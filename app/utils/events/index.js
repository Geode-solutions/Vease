// Third party imports

// Local imports
import { Status } from "@ogw_front/utils/status";
import { useBackStore } from "@ogw_front/stores/back.js";
import { useEventSource } from "@vueuse/core";
import { useViewerStore } from "@ogw_front/stores/viewer.js";

import { backEventHandlers } from "./back.js";
import { viewerEventHandlers } from "./viewer.js";

function getEventHandler(eventName, handlerMap) {
  const handler = handlerMap[eventName];
  if (!handler) {
    throw new Error(`No handler found for event "${eventName}"`);
  }
  return handlerMap[eventName];
}

function dispatchEvent(eventName, rawPayload, handlerMap, source) {
  console.log(`[${source}] Event received:`, eventName, rawPayload);

  const handler = getEventHandler(eventName, handlerMap);
  if (!handler) {
    return;
  }

  let payload = undefined;
  try {
    payload = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
  } catch (error) {
    console.error(`[${source}] Failed to parse payload for "${eventName}":`, rawPayload, error);
    return;
  }

  handler(payload);
}

function connectToEventSource() {
  const backStore = useBackStore();
  console.log("[PLUGIN] Connecting to EventSource...");
  const url = computed(() => `${backStore.base_url}/events`);
  console.log("[PLUGIN] EventSource URL:", url.value);

  const { event, data, status, error } = useEventSource(url, Object.keys(backEventHandlers), {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.error("[PLUGIN] EventSource connection failed after 3 retries.");
      },
    },
  });

  console.log("[PLUGIN]", { event, data, status, error });

  watch([event, data], ([eventName, rawData]) => {
    if (!eventName) { return };
    console.log("[Back] Event received:", eventName, rawData);
    dispatchEvent(eventName, rawData, backEventHandlers, "BACK");
  }, { immediate: true });
}

function connectToWebSocket() {
  const viewerStore = useViewerStore();
  let subscribedSession = undefined;

  watch(
    () => viewerStore.status,
    (status) => {
      if (status !== Status.CONNECTED) { return };
      const session = viewerStore.client.getConnection().getSession();
      if (session === subscribedSession) { return };
      subscribedSession = session;

      for (const eventName of Object.keys(viewerEventHandlers)) {
        session.subscribe(eventName, ([payload]) => {
          dispatchEvent(eventName, payload, viewerEventHandlers, "VIEWER");
        });
      }
    },
    { immediate: true },
  );
}

export { connectToEventSource, connectToWebSocket };
