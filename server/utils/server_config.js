const storage = new Map();

function getGatewayApiKey() {
  return storage.get("GATEWAY_API_KEY");
}
function setGatewayApiKey(apiKey) {
  return storage.set("GATEWAY_API_KEY", apiKey);
}
function clearGatewayApiKey() {
  return storage.delete("GATEWAY_API_KEY");
}

export { clearGatewayApiKey, getGatewayApiKey, setGatewayApiKey };
