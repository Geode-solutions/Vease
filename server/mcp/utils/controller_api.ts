// Local imports
import { getAppBaseUrl } from "@ogw_server/utils/server_config";

interface CallControllerApiOptions {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  errorPrefix: string;
}

// oxlint-disable-next-line eslint/id-length
type CallControllerApiResult = { ok: true; payload: unknown } | { ok: false; message: string };

function extractErrorMessage(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  if ("statusMessage" in value && typeof value.statusMessage === "string") {
    return value.statusMessage;
  }

  if ("message" in value && typeof value.message === "string") {
    return value.message;
  }

  if ("data" in value) {
    return extractErrorMessage(value.data);
  }

  return undefined;
}

export async function callControllerApi(
  path: string,
  { method = "POST", headers, body, errorPrefix }: CallControllerApiOptions,
): Promise<CallControllerApiResult> {
  try {
    const appBaseUrl = getAppBaseUrl();
    // oxlint-disable-next-line unicorn/no-invalid-fetch-options
    const response = await fetch(`${appBaseUrl}${path}`, { method, headers, body });

    if (!response.ok) {
      const errorPayload: unknown = await response.json().catch(() => ({}));
      const message = extractErrorMessage(errorPayload) ?? response.statusText ?? "Unknown error";
      // oxlint-disable-next-line eslint/id-length
      return { ok: false, message: `${errorPrefix}: ${message}` };
    }

    const payload: unknown = await response.json().catch(() => undefined);
    // oxlint-disable-next-line eslint/id-length
    return { ok: true, payload };
  } catch (error) {
    const message = extractErrorMessage(error) ?? "Unknown error";
    // oxlint-disable-next-line eslint/id-length
    return { ok: false, message: `${errorPrefix}: ${message}` };
  }
}
