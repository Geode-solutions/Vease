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
  if (failed) {
    return Response.json(payload, { status: BAD_REQUEST, statusText: "Bad Request" });
  }
  return Response.json(payload);
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

function requestUrl(url: Parameters<typeof fetch>[0]): string {
  if (url instanceof Request) {
    return url.url;
  }
  return url.toString();
}

function parseBody(body: RequestInit["body"]): unknown {
  if (typeof body === "string") {
    return JSON.parse(body);
  }
  return body;
}

// The single request sent, with its JSON body parsed so key order and undefined keys don't matter
function sentRequest(fetchMock: Mock<typeof fetch>): ControllerRequest {
  const [call] = fetchMock.mock.calls;
  if (call === undefined) {
    throw new Error("No controller request was sent");
  }
  const [url, init] = call;
  return {
    url: requestUrl(url),
    method: init?.method,
    headers: init?.headers,
    body: parseBody(init?.body),
  };
}

export { controllerUrl, jsonResponse, sentRequest, stubControllerFetch };
