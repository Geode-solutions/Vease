// Third party imports
import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  if (!event.node.req.url?.startsWith("/mcp")) {
    return;
  }

  const origin = getHeader(event, "origin");
  const requestedHeaders = getHeader(event, "access-control-request-headers");

  if (origin) {
    setHeader(event, "Access-Control-Allow-Origin", origin);
  }
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
