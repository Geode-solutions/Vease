// Third party imports
import { consola } from "consola";

// Local imports
import { EVENTS_SOURCE } from "@vease/utils/activity_display";
import { getBackStore } from "@vease/utils/external_stores";
import { useActivityStore } from "@ogw_front/stores/activity";
import { useEventSource } from "@vueuse/core";

import { backEventHandlers } from "./back";

type EventHandlerMap = Record<string, (payload: unknown) => unknown>;

// "2 objects" for the events carrying a data list (save_viewable_file)
function eventLabel(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null || !("data" in payload)) {
    return undefined;
  }
  if (!Array.isArray(payload.data)) {
    return undefined;
  }
  const count = payload.data.length;
  return `${count} ${count === 1 ? "object" : "objects"} received`;
}

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

  let payload: unknown = rawPayload;
  try {
    if (typeof rawPayload === "string") {
      payload = JSON.parse(rawPayload) as unknown;
    }
  } catch (error) {
    consola.error(`[${source}] Failed to parse payload for "${eventName}":`, rawPayload, error);
    return;
  }

  useActivityStore().log({
    source: EVENTS_SOURCE,
    kind: "event",
    route: eventName,
    status: "info",
    label: eventLabel(payload),
    params: payload,
  });
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

export { connectToEventSource };
