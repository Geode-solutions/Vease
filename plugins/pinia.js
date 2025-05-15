import { BroadcastChannel, createLeaderElection } from "broadcast-channel";

function serialize(obj, keysToUpdate) {
  obj = Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToUpdate.includes(key))
  );
  return JSON.parse(JSON.stringify(obj));
}

function stateHasKey(key, $state) {
  return Object.keys($state).includes(key);
}

function PiniaSharedState() {
  return async ({ store, options }) => {
    const omittedKeys = options?.share?.omit ?? [];
    store.is_sync = false;
    const channel = new BroadcastChannel(store.$id);
    const election = createLeaderElection(channel);
    let timestamp = 0;
    let externalUpdate = false;
    const keysToUpdate = Object.keys(store.$state).filter(
      (key) => !omittedKeys.includes(key) && stateHasKey(key, store.$state)
    );
    channel.onmessage = (newState) => {
      if (newState === void 0) {
        channel.postMessage({
          timestamp,
          state: serialize(store.$state, keysToUpdate),
        });
        return;
      }
      if (newState.timestamp <= timestamp) return;

      externalUpdate = true;
      timestamp = newState.timestamp;
      store.$patch((state) => {
        keysToUpdate.forEach((key) => {
          state[key] = newState.state[key];
        });
      });
      store.is_sync = true;
    };
    if (await election.hasLeader()) {
      channel.postMessage(void 0);
    } else {
      await election.awaitLeadership();
      store.is_sync = true;
    }
    store.$subscribe((_, state) => {
      if (!externalUpdate) {
        timestamp = Date.now();
        channel.postMessage({
          timestamp,
          state: serialize(state, keysToUpdate),
        });
      }
      externalUpdate = false;
    });
  };
}

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.$pinia.use(PiniaSharedState());
});

console.log("PINIA PLUGIN");
