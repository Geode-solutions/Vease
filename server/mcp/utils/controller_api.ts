// Local imports
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.js";

interface CallControllerApiOptions {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  errorPrefix: string;
}

// oxlint-disable-next-line eslint/id-length
type CallControllerApiResult = { ok: true; payload: unknown } | { ok: false; message: string };

export async function callControllerApi(
  path: string,
  { method = "POST", headers, body, errorPrefix }: CallControllerApiOptions,
): Promise<CallControllerApiResult> {
  try {
    const appBaseUrl = getAppBaseUrl();
    // oxlint-disable-next-line unicorn/no-invalid-fetch-options
    const response = await fetch(`${appBaseUrl}${path}`, { method, headers, body });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const message =
        errorPayload?.statusMessage ??
        errorPayload?.message ??
        response.statusText ??
        "Unknown error";
      // oxlint-disable-next-line eslint/id-length
      return { ok: false, message: `${errorPrefix}: ${message}` };
    }

    const payload = await response.json().catch(() => undefined);
    // oxlint-disable-next-line eslint/id-length
    return { ok: true, payload };
  } catch (error) {
    const err = error as { data?: { statusMessage?: string }; message?: string };
    const message = err?.data?.statusMessage ?? err?.message ?? "Unknown error";
    // oxlint-disable-next-line eslint/id-length
    return { ok: false, message: `${errorPrefix}: ${message}` };
  }
}
