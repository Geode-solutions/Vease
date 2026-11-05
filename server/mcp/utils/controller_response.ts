function controllerResponse(payload: unknown): unknown {
  return typeof payload === "object" && payload !== null && "response" in payload
    ? payload.response
    : payload;
}

export { controllerResponse };
