// Local imports
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.js";

export async function callControllerApi(path, { method = "POST", headers, body, errorPrefix }) {
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
    const message = error?.data?.statusMessage ?? error?.message ?? "Unknown error";
    // oxlint-disable-next-line eslint/id-length
    return { ok: false, message: `${errorPrefix}: ${message}` };
  }
}
