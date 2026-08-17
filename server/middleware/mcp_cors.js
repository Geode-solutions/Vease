export default defineEventHandler((event) => {
  console.log("TEST", event.node.req.method, event.node.req.url);
  if (!event.node.req.url?.startsWith("/mcp")) { return };

  const origin = getHeader(event, "origin") || "http://127.0.0.1:54321";
  const requestedHeaders = getHeader(event, "access-control-request-headers");

  setHeader(event, "Access-Control-Allow-Origin", origin);
  setHeader(event, "Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  setHeader(
    event,
    "Access-Control-Allow-Headers",
    requestedHeaders || "Content-Type, Accept, Mcp-Protocol-Version",
  );

  if (event.node.req.method === "OPTIONS") {
    const statusCode_204 = 204;
    setResponseStatus(event, statusCode_204);
    return "";
  }
});
