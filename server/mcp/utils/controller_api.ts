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

  // ErrorResponse body sent by the typed routes
  if ("description" in value && typeof value.description === "string") {
    return value.description;
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

async function callControllerApi(
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

interface ControllerActionOptions {
  // Params the action's route takes
  accepted: readonly string[];
  // Ends the error naming the params given but not accepted, e.g. "to rename"
  context: string;
  errorPrefix: string;
}

// The route schema rejects a stray param without naming it, so name it here for the model
async function callControllerAction(
  path: string,
  params: Record<string, unknown>,
  { accepted, context, errorPrefix }: ControllerActionOptions,
): Promise<CallControllerApiResult> {
  const stray = Object.keys(params).filter(
    (key) => params[key] !== undefined && !accepted.includes(key),
  );
  if (stray.length > 0) {
    // oxlint-disable-next-line eslint/id-length
    return { ok: false, message: `${errorPrefix}: ${stray.join(", ")} cannot be given ${context}` };
  }
  const result = await callControllerApi(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    errorPrefix,
  });
  return result;
}

export { callControllerAction, callControllerApi };
