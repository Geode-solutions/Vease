import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { errResult, okResult } from "@vease_tests/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { getAppBaseUrl } from "@ogw_server/utils/server_config";

vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getAppBaseUrl: vi.fn<typeof getAppBaseUrl>(),
}));

// Mirrors the real Fetch API Response shape; "ok" is the platform's own
// 2-letter field name, same unavoidable id-length tradeoff as elsewhere.
function fakeFetchResponse(options: {
  ok: boolean;
  statusText?: string;
  json: () => Promise<unknown>;
}): Response {
  return options as unknown as Response;
}

describe("callControllerApi()", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.mocked(getAppBaseUrl).mockReturnValue("http://localhost:3000");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  test("returns the parsed JSON payload on a successful response", async () => {
    fetchMock.mockResolvedValue(
      fakeFetchResponse({ ok: true, json: () => Promise.resolve({ id: "item-1" }) }),
    );

    const result = await callControllerApi("/api/controller/data/load", {
      errorPrefix: "Error loading file",
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/controller/data/load", {
      method: "POST",
      headers: undefined,
      body: undefined,
    });
    expect(result).toStrictEqual(okResult({ id: "item-1" }));
  });

  test("passes through a custom method, headers and body", async () => {
    fetchMock.mockResolvedValue(fakeFetchResponse({ ok: true, json: () => Promise.resolve({}) }));

    await callControllerApi("/api/controller/viewer/render", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: "raw-body",
      errorPrefix: "Error",
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/controller/viewer/render", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: "raw-body",
    });
  });

  test("extracts a statusMessage from a failed response's error payload", async () => {
    fetchMock.mockResolvedValue(
      fakeFetchResponse({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({ statusMessage: "Invalid file type" }),
      }),
    );

    const result = await callControllerApi("/api/controller/data/load", {
      errorPrefix: "Error loading file",
    });

    expect(result).toStrictEqual(errResult("Error loading file: Invalid file type"));
  });

  test("falls back to a nested message, then statusText, then a generic message", async () => {
    fetchMock.mockResolvedValueOnce(
      fakeFetchResponse({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({ data: { message: "nested" } }),
      }),
    );
    const nested = await callControllerApi("/x", { errorPrefix: "Error" });
    expect(nested).toStrictEqual(errResult("Error: nested"));

    fetchMock.mockResolvedValueOnce(
      fakeFetchResponse({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.reject(new Error("not json")),
      }),
    );
    const fallsBackToStatusText = await callControllerApi("/x", { errorPrefix: "Error" });
    expect(fallsBackToStatusText).toStrictEqual(errResult("Error: Bad Request"));
  });

  test("reports a network failure's message through the error prefix", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const result = await callControllerApi("/api/controller/data/load", {
      errorPrefix: "Error loading file",
    });

    expect(result).toStrictEqual(errResult("Error loading file: Failed to fetch"));
  });

  test("falls back to a generic message when the thrown value has none", async () => {
    fetchMock.mockRejectedValue("a plain string, not an Error");

    const result = await callControllerApi("/api/controller/data/load", {
      errorPrefix: "Error loading file",
    });

    expect(result).toStrictEqual(errResult("Error loading file: Unknown error"));
  });

  test("extracts a message from a thrown error object with a message field", async () => {
    fetchMock.mockRejectedValue({ message: "socket hang up" });

    const result = await callControllerApi("/api/controller/data/load", {
      errorPrefix: "Error loading file",
    });

    expect(result).toStrictEqual(errResult("Error loading file: socket hang up"));
  });
});
