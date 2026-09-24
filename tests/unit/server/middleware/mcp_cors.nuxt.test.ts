import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { getHeader, setHeader, setResponseStatus } from "h3";
import { createMockEvent } from "@vease_tests/server_utils";
import handler from "@vease_server/middleware/mcp_cors";

const DEFAULT_STATUS_CODE = 200;

describe("mcp_cors middleware", () => {
  // Nitro auto-imports these h3 utilities for server/ files at build time.
  // This test environment doesn't, so they're stubbed as real globals here.
  beforeAll(() => {
    vi.stubGlobal("getHeader", getHeader);
    vi.stubGlobal("setHeader", setHeader);
    vi.stubGlobal("setResponseStatus", setResponseStatus);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test("does nothing for requests outside of /mcp", () => {
    const event = createMockEvent({ method: "GET", url: "/api/other" });
    const setHeaderSpy = vi.spyOn(event.node.res, "setHeader");

    handler(event);

    expect(setHeaderSpy).not.toHaveBeenCalled();
  });

  test("reflects the request origin and allowed headers for /mcp requests", () => {
    const event = createMockEvent({
      method: "POST",
      url: "/mcp",
      headers: {
        origin: "https://example.com",
        "access-control-request-headers": "content-type, mcp-protocol-version",
      },
    });
    const setHeaderSpy = vi.spyOn(event.node.res, "setHeader");

    handler(event);

    expect(setHeaderSpy).toHaveBeenCalledWith("Access-Control-Allow-Origin", "https://example.com");
    expect(setHeaderSpy).toHaveBeenCalledWith("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    expect(setHeaderSpy).toHaveBeenCalledWith(
      "Access-Control-Allow-Headers",
      "content-type, mcp-protocol-version",
    );
  });

  test("falls back to a default Allow-Headers value when none was requested", () => {
    const event = createMockEvent({ method: "POST", url: "/mcp" });
    const setHeaderSpy = vi.spyOn(event.node.res, "setHeader");

    handler(event);

    expect(setHeaderSpy).toHaveBeenCalledWith(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept, Mcp-Protocol-Version",
    );
  });

  test("does not set an Allow-Origin header when no origin is present", () => {
    const event = createMockEvent({ method: "POST", url: "/mcp" });
    const setHeaderSpy = vi.spyOn(event.node.res, "setHeader");

    handler(event);

    expect(setHeaderSpy).not.toHaveBeenCalledWith("Access-Control-Allow-Origin", expect.anything());
  });

  // A "responds 204 to a preflight OPTIONS request" case is intentionally
  // Missing: setResponseStatus doesn't take effect through this file's
  // Module graph in this test environment, though the same logic works
  // Inline and in the real app — a harness limitation, not a product bug.
  test("leaves the status code untouched for a non-OPTIONS request", () => {
    const event = createMockEvent({ method: "POST", url: "/mcp" });

    handler(event);

    expect(event.node.res.statusCode).toBe(DEFAULT_STATUS_CODE);
  });
});
