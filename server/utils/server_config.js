const storage = new Map();

function getGatewayApiKey() {
  return storage.get("GATEWAY_API_KEY");
}
function setGatewayApiKey(apiKey) {
  return storage.set("GATEWAY_API_KEY", apiKey);
}

export { getGatewayApiKey, setGatewayApiKey };
