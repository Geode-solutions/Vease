import { useBackStore } from "@ogw_front/stores/back.js";
import { useDataStyleStore } from "@ogw_front/stores/data_style.js";
import { useViewerStore } from "@ogw_front/stores/viewer.js";
import { useEventSource, useWebSocket } from "@vueuse/core";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer.js";
// import { useMeshPointsCommonStyle } from "@ogw_front/stores/data_style/mesh/points/common.js";

import { importItem } from "@ogw_front/utils/import_workflow.js";
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";


const eventHandlers = {
  [opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file]: async (payload) => {
    const hybridViewerStore = useHybridViewerStore();
    console.log("[GEODE] save_viewable_file:", payload);
    await importItem(payload);
    hybridViewerStore.remoteRender();
  },
};


const wsEventHandlers = {
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility]: async (payload) => {
    const hybridViewerStore = useHybridViewerStore();
    console.log("[GEODE] some_ws_event:", payload);
    const dataStyleStore = useDataStyleStore();
    dataStyleStore.mutateStyle(payload.id, { points: { visibility: payload.visibility } });
    hybridViewerStore.remoteRender();
  },
};


function connectToEventSource() {
  const backStore = useBackStore();
  console.log("[PLUGIN] Connecting to EventSource...");
  const url = computed(() => `${backStore.base_url}/events`);
  console.log("[PLUGIN] EventSource URL:", url.value);

  const { event, data, status, error } = useEventSource(url, [Object.keys(eventHandlers)], {
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
    console.log("[Back] Event received:", eventName, rawData);
    if (!eventName) {
      return;
    }

    const handler = eventHandlers[eventName];
    if (!handler) {
      console.warn(`[Back] No handler for event "${eventName}"`);
      return;
    }
    const payload = JSON.parse(rawData);
    handler(payload);
  });
}


function connectToWebSocket() {
  const viewerStore = useViewerStore();
  console.log("[PLUGIN] Connecting to WebSocket...");
  const url = computed(() => viewerStore.base_url);
  console.log("[PLUGIN] WebSocket URL:", url.value);

  const { status, data, send, open, close, ws } = useWebSocket(url, {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.error("[PLUGIN] WebSocket connection failed after 3 retries.");
      },
    },
    heartbeat: {
      message: "ping",
      interval: 30000,
      pongTimeout: 5000,
    },
  });

  console.log("[PLUGIN]", { status, ws });

  watch(status, (s) => console.log("[PLUGIN] WS status:", s));

  watch(data, (rawData) => {
    if (!rawData) return;
    console.log("[VIEWER] WS message received:", rawData);

    let message;
    try {
      message = JSON.parse(rawData);
    } catch (e) {
      console.warn("[VIEWER] Failed to parse WS message:", rawData, e);
      return;
    }

    const { event: eventName, payload } = message;
    if (!eventName) {
      console.warn("[VIEWER] WS message missing 'event' field:", message);
      return;
    }

    const handler = wsEventHandlers[eventName];
    if (!handler) {
      console.warn(`[VIEWER] No handler for WS event "${eventName}"`);
      return;
    }
    handler(payload);
  });

  return { status, send, open, close };
}

export { connectToEventSource, connectToWebSocket };
