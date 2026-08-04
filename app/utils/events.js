import { useBackStore } from "@ogw_front/stores/back.js";
import { useEventSource } from "@vueuse/core";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer.js";

import { importItem } from "@ogw_front/utils/import_workflow.js";

const eventHandlers = {
  "opengeodeweb_back.save_viewable_file": async (payload) => {
    const hybridViewerStore = useHybridViewerStore();
    console.log("[GEODE] save_viewable_file:", payload);
    await importItem(payload);
    hybridViewerStore.remoteRender();
  },
};

function connectToEventSource() {
  const backStore = useBackStore();
  console.log("[PLUGIN] Connecting to EventSource...");
  const url = computed(() => `${backStore.base_url}/events`);
  console.log("[PLUGIN] EventSource URL:", url.value);

  const { event, data, status, error } = useEventSource(url, [...events.keys()], {
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
    console.log("[GEODE] Event received:", eventName, rawData);
    if (!eventName) {
      return;
    }

    const handler = eventHandlers[eventName];
    if (!handler) {
      console.warn(`[GEODE] No handler for event "${eventName}"`);
      return;
    }
    const payload = JSON.parse(rawData);
    handler(payload);
  });
}

export { connectToEventSource };
