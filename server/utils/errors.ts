export interface ErrorLike {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
}

export function asErrorLike(error: unknown): ErrorLike {
  return error as ErrorLike;
}
