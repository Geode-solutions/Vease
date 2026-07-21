import { useBackStore } from "@ogw_front/stores/back.js";
import { useEventSource } from '@vueuse/core'
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer.js";

import { importItem } from "@ogw_front/utils/import_workflow.js";



function connectToEventSource() {
  const hybridViewerStore = useHybridViewerStore();
  const backStore = useBackStore();
  console.log("[PLUGIN] Connecting to EventSource...");
  const url = computed(() => `${backStore.base_url}/events`);
  console.log("[PLUGIN] EventSource URL:", url.value);

  const { event, data, status, error } = useEventSource(
    url,
    ["opengeodeweb_back.save_viewable_file", "update"],
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
    "opengeodeweb_back.save_viewable_file": async (payload) => {
      console.log("[GEODE] save_viewable_file:", payload);
      await importItem(payload)
      hybridViewerStore.remoteRender();
    },
  };

  watch([event, data], ([eventName, rawData]) => {
    console.log("[GEODE] Event received:", eventName, rawData);
    if (!eventName) { return };

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