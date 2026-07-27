import { useStorage } from "#imports";

function getConfig() {
  return useStorage("config");
}
function getBackBaseUrl() {
  const config = getConfig();
  return config.getItem("BACK_BASE_URL");
}
function setBackBaseUrl(baseUrl) {
  const config = getConfig();
  return config.setItem("BACK_BASE_URL", baseUrl);
}
function getViewerBaseUrl() {
  const config = getConfig();
  return config.getItem("VIEWER_BASE_URL");
}
function setViewerBaseUrl(baseUrl) {
  const config = getConfig();
  return config.setItem("VIEWER_BASE_URL", baseUrl);
}

export {
  getBackBaseUrl,
  getViewerBaseUrl,
  setBackBaseUrl,
  setViewerBaseUrl,
};