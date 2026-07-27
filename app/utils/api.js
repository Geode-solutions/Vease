import { useAppStore } from "@ogw_front/stores/app.js";


function setBackBaseUrl(baseUrl) {
  console.log("[API] setBackBaseUrl", baseUrl);
  const appStore = useAppStore();
  const schema = {
    $id: "/api/set_back_base_url",
    methods: ["POST"],
    type: "object",
    properties: {
      baseUrl: { type: "string" },
    },
    required: ["baseUrl"],
    additionalProperties: true,
  };
  const params = { baseUrl };
  console.log("[APP] params", params);
  return appStore.request({ schema, params });
}

function setViewerBaseUrl(baseUrl) {
  console.log("[API] setViewerBaseUrl", baseUrl);
  const appStore = useAppStore();
  const schema = {
    $id: "/api/set_viewer_base_url",
    methods: ["POST"],
    type: "object",
    properties: {
      baseUrl: { type: "string" },
    },
    required: ["baseUrl"],
    additionalProperties: true,
  };
  const params = { baseUrl };
  console.log("[APP] params", params);
  return appStore.request({ schema, params });
}

export { setBackBaseUrl, setViewerBaseUrl };