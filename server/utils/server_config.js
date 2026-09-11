const storage = new Map();

function getGatewayApiKey() {
  console.log("Getting gateway API key from storage", storage.get("GATEWAY_API_KEY"));
  return storage.get("GATEWAY_API_KEY");
}
function setGatewayApiKey(apiKey) {
  console.log("Setting gateway API key in storage", apiKey);
  return storage.set("GATEWAY_API_KEY", apiKey);
}
function clearGatewayApiKey() {
  console.log("Clearing gateway API key from storage", storage.get("GATEWAY_API_KEY"));
  return storage.delete("GATEWAY_API_KEY");
}

export { clearGatewayApiKey, getGatewayApiKey, setGatewayApiKey };
