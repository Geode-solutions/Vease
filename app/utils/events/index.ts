// Third party imports
import { consola } from "consola";

// Local imports
import { Status } from "@ogw_front/utils/status";
import { useEventSource } from "@vueuse/core";
import { useViewerStore } from "@ogw_front/stores/viewer.js";

import { getBackStore, getViewerClient } from "@vease/utils/external_stores";
import { backEventHandlers } from "./back";
import { viewerEventHandlers } from "./viewer";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ViewerSession } from "@vease/utils/external_stores";

type EventHandlerMap = Record<string, (payload: unknown) => unknown>;

function getEventHandler(
  eventName: string,
  handlerMap: EventHandlerMap,
): (payload: unknown) => unknown {
  const handler = handlerMap[eventName];
  if (!handler) {
    throw new Error(`No handler found for event "${eventName}"`);
  }
  return handler;
}

function dispatchEvent(
  eventName: string,
  rawPayload: unknown,
  handlerMap: EventHandlerMap,
  source: string,
): void {
  consola.debug(`[${source}] Event received:`, eventName, rawPayload);

  const handler = getEventHandler(eventName, handlerMap);

  let payload: unknown = undefined;
  try {
    payload = typeof rawPayload === "string" ? (JSON.parse(rawPayload) as unknown) : rawPayload;
  } catch (error) {
    consola.error(`[${source}] Failed to parse payload for "${eventName}":`, rawPayload, error);
    return;
  }

  handler(payload);
}

function connectToEventSource(): void {
  const backStore = getBackStore();
  consola.info("[PLUGIN] Connecting to EventSource...");
  const url = computed(() => `${backStore.base_url}/events`);
  consola.info("[PLUGIN] EventSource URL:", url.value);

  const { event, data } = useEventSource(url, Object.keys(backEventHandlers), {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        consola.error("[PLUGIN] EventSource connection failed after 3 retries.");
      },
    },
  });

  watch(
    [event, data],
    ([eventName, rawData]) => {
      if (typeof eventName !== "string" || eventName === "") {
        return;
      }
      consola.debug("[Back] Event received:", eventName, rawData);
      dispatchEvent(eventName, rawData, backEventHandlers, "BACK");
    },
    { immediate: true },
  );
}

function connectToWebSocket(): void {
  const viewerStore = useViewerStore();
  let subscribedSession: ViewerSession | undefined = undefined;

  watch(
    () => viewerStore.status,
    (status) => {
      if (status !== Status.CONNECTED) {
        return;
      }
      const session = getViewerClient(viewerStore).getConnection().getSession();
      if (session === subscribedSession) {
        return;
      }
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
