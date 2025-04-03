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
    // store.$state.is_sync = false;
    store.is_sync = false;
    // console.log("store.$id", store.$id, store.$state);
    // console.log("is_sync = false");
    const channel = new BroadcastChannel(store.$id);
    const election = createLeaderElection(channel);
    let timestamp = 0;
    let externalUpdate = false;
    const keysToUpdate = Object.keys(store.$state).filter(
      (key) => !omittedKeys.includes(key) && stateHasKey(key, store.$state)
    );
    // console.log("keysToUpdate", keysToUpdate);
    channel.onmessage = (newState) => {
      // console.log("channel.onmessage");
      if (newState === void 0) {
        // console.log("void 0");
        channel.postMessage({
          timestamp,
          state: serialize(store.$state, keysToUpdate),
        });
        // console.log("postMessage");
        return;
      }
      // console.log("newState.timestamp <= timestamp");

      if (newState.timestamp <= timestamp) return;
      // console.log("post RETURN");

      externalUpdate = true;
      timestamp = newState.timestamp;
      store.$patch((state) => {
        keysToUpdate.forEach((key) => {
          console.log("keysToUpdate", key);
          state[key] = newState.state[key];
        });
        // console.log("IS SYNC", store.$id, store);
      });
      store.is_sync = true;
    };
    if (await election.hasLeader()) {
      // console.log("leader !");
      channel.postMessage(void 0);
    } else {
      // console.log("no leader !");
      await election.awaitLeadership();
      store.is_sync = true;
    }
    store.$subscribe((_, state) => {
      if (!externalUpdate) {
        timestamp = Date.now();
        console.log(timestamp);
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
