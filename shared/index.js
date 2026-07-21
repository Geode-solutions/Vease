import { useEventSource } from '@vueuse/core'
import { useBackStore } from "@ogw_front/stores/back.js";


function connectToEventSource() {
  const backStore = useBackStore();
  console.log("[PLUGIN] Connecting to EventSource...");
  const url = computed(() => `${backStore.base_url}/events`);
  console.log("[PLUGIN] EventSource URL:", url.value);

  const { event, data, status, error } = useEventSource(
    url,
    ["save_viewable_file", "update"],
    {
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          alert("Failed to connect EventSource after 3 retries");
        },
      },
    },
  );

  console.log("[PLUGIN]", { event, data, status, error });



  const eventHandlers = {
    save_viewable_file: (payload) => {
      console.log("[GEODE] save_viewable_file:", payload);
      // e.g. refresh viewer, update store state
    },
  };

  watch([event, data], ([eventName, rawData]) => {
    if (!eventName) return;

    const handler = eventHandlers[eventName];
    if (!handler) {
      console.warn(`[GEODE] No handler for event "${eventName}"`);
      return;
    }

    let payload = rawData;
    try {
      payload = JSON.parse(rawData);
    } catch {
      // rawData wasn't JSON, use as-is
    }

    handler(payload);
  });
}

export { connectToEventSource };