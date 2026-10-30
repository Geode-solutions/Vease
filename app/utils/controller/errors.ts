class ControllerError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ControllerError";
  }
}

function need<Value>(action: string, field: string, value: Value | undefined): Value {
  if (value === undefined) {
    throw new ControllerError(`${action} needs ${field}`);
  }
  return value;
}

// A failed $fetch carries the ErrorResponse body of the microservice, more telling than its message
function errorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "description" in error.data &&
    typeof error.data.description === "string"
  ) {
    return error.data.description;
  }
  return error instanceof Error ? error.message : String(error);
}

export { ControllerError, errorMessage, need };
