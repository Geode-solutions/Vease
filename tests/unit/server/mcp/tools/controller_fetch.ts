// Third party imports
import { type Mock, vi } from "vitest";

// Local imports
import { setAppBaseUrl } from "@ogw_server/utils/server_config";

const APP_BASE_URL = "http://localhost:3000";

interface ControllerRequest {
  url: string;
  method: string | undefined;
  headers: HeadersInit | undefined;
  body: unknown;
}

const BAD_REQUEST = 400;

function jsonResponse(payload: unknown, { failed = false } = {}): Response {
  return Response.json(payload, failed ? { status: BAD_REQUEST, statusText: "Bad Request" } : {});
}

// Lets the tools run the real callControllerAction, so the routing and stray-param checks are tested
function stubControllerFetch(fetchMock: Mock<typeof fetch>): void {
  setAppBaseUrl(APP_BASE_URL);
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
}

function controllerUrl(route: string): string {
  return `${APP_BASE_URL}/api/controller/${route}`;
}

// The single request sent, with its JSON body parsed so key order and undefined keys don't matter
function sentRequest(fetchMock: Mock<typeof fetch>): ControllerRequest {
  const [call] = fetchMock.mock.calls;
  if (call === undefined) {
    throw new Error("No controller request was sent");
  }
  const [url, init] = call;
  return {
    url: url instanceof Request ? url.url : url.toString(),
    method: init?.method,
    headers: init?.headers,
    body: typeof init?.body === "string" ? JSON.parse(init.body) : init?.body,
  };
}

export { controllerUrl, jsonResponse, sentRequest, stubControllerFetch };
