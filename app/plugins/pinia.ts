//oxlint-disable unicorn/require-post-message-target-origin
import { BroadcastChannel, createLeaderElection } from "broadcast-channel";
import type { PiniaPluginContext, StateTree } from "pinia";

interface SharedStateMessage {
  timestamp: number;
  state: Record<string, unknown>;
}

interface ShareOptions {
  share?: {
    omit?: string[];
  };
}

function serialize(obj: StateTree, keysToUpdate: string[]): Record<string, unknown> {
  const object = Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToUpdate.includes(key)),
  );
  return structuredClone(object);
}

function stateHasKey(key: string, $state: StateTree): boolean {
  return Object.keys($state).includes(key);
}

// oxlint-disable-next-line eslint/no-unused-vars
function piniaSharedState() {
  return async ({ store, options }: PiniaPluginContext): Promise<void> => {
    const omittedKeys = (options as ShareOptions).share?.omit ?? [];
    store.is_sync = false;
    const channel = new BroadcastChannel<SharedStateMessage | undefined>(store.$id);
    const election = createLeaderElection(channel);
    let timestamp = 0;
    let externalUpdate = false;
    const keysToUpdate = Object.keys(store.$state).filter(
      (key) => !omittedKeys.includes(key) && stateHasKey(key, store.$state),
    );
    channel.addEventListener("message", (newState) => {
      if (newState === undefined) {
        void channel.postMessage({
          timestamp,
          state: serialize(store.$state, keysToUpdate),
        });
        return;
      }
      const { timestamp: incomingTimestamp, state: incomingState } = newState;
      if (incomingTimestamp <= timestamp) {
        return;
      }
      externalUpdate = true;
      timestamp = incomingTimestamp;
      store.$patch((state: StateTree) => {
        for (const key of keysToUpdate) {
          state[key] = incomingState[key];
        }
      });
      store.is_sync = true;
    });
    if (await election.hasLeader()) {
      void channel.postMessage(undefined);
    } else {
      await election.awaitLeadership();
      store.is_sync = true;
    }
    store.$subscribe((_mutation, state: StateTree) => {
      if (!externalUpdate) {
        timestamp = Date.now();
        void channel.postMessage({
          timestamp,
          state: serialize(state, keysToUpdate),
        });
      }
      externalUpdate = false;
    });
  };
}

const piniaPlugin = defineNuxtPlugin((nuxtApp) => {
  const { $pinia } = nuxtApp;
  void $pinia;
  // $pinia.use(piniaSharedState());
});

console.log("PINIA PLUGIN");

export default piniaPlugin;
