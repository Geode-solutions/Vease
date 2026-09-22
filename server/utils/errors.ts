function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface ErrorLike {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
}

export function asErrorLike(error: unknown): ErrorLike {
  if (!isRecord(error)) {
    return {};
  }

  const { statusCode, statusMessage, message } = error;

  return {
    statusCode: typeof statusCode === "number" ? statusCode : undefined,
    statusMessage: typeof statusMessage === "string" ? statusMessage : undefined,
    message: typeof message === "string" ? message : undefined,
  };
}
