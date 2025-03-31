import { BroadcastChannel } from "broadcast-channel";

function serialize(
  obj,
  keysToUpdate,
  serializer = { serialize: JSON.stringify, deserialize: JSON.parse }
) {
  obj = Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToUpdate.includes(key))
  );
  return serializer.deserialize(serializer.serialize(obj));
}

function stateHasKey(key, $state) {
  return Object.keys($state).includes(key);
}
function PiniaSharedState({
  enable = true,
  initialize = true,
  type,
  serializer,
}) {
  return ({ store, options }) => {
    const isEnabled = options?.share?.enable ?? enable;
    const omittedKeys = options?.share?.omit ?? [];
    if (!isEnabled) return;
    store.$state.is_sync = false;
    const channel = new BroadcastChannel(store.$id, {
      type,
    });
    let timestamp = 0;
    let externalUpdate = false;
    const keysToUpdate = Object.keys(store.$state).filter(
      (key) => !omittedKeys.includes(key) && stateHasKey(key, store.$state)
    );
    channel.onmessage = (newState) => {
      if (newState === void 0) {
        channel.postMessage({
          timestamp,
          state: serialize(store.$state, keysToUpdate, serializer),
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
        state.is_sync = true;
      });
    };
    const shouldInitialize = options?.share?.initialize ?? initialize;
    if (shouldInitialize) channel.postMessage(void 0);
    store.$subscribe((_, state) => {
      if (!externalUpdate) {
        timestamp = Date.now();
        console.log(timestamp);
        channel.postMessage({
          timestamp,
          state: serialize(state, keysToUpdate, serializer),
        });
      }
      externalUpdate = false;
    });
  };
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(PiniaSharedState({}));
});

console.log("PINIA PLUGIN");
