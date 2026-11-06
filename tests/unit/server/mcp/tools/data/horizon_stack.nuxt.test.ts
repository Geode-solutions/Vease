import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  controllerUrl,
  jsonResponse,
  sentRequest,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import tool from "@vease_server/mcp/tools/data/horizon_stack";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const STACK_ID = "0123456789abcdef0123456789abcdef";

describe("create-horizon-stack MCP tool", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("posts the stack to /api/controller/horizon_stack/create", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { id: STACK_ID, name: "stack" } }),
    );

    const result = await tool.handler(
      { name: "stack", horizons: ["Top", "Bottom"], unitNames: ["A", "B", "C"] },
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toStrictEqual({
      url: controllerUrl("horizon_stack/create"),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: "stack", horizons: ["Top", "Bottom"], unit_names: ["A", "B", "C"] },
    });
    expect(result).toBe(`Horizon stack created: {"id":"${STACK_ID}","name":"stack"}`);
  });

  test("reports the controller error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ description: "1 horizons need 2 unit names, got 1" }, { failed: true }),
    );

    const result = await tool.handler(
      { name: "stack", horizons: ["Top"], unitNames: ["A"] },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error creating horizon stack: 1 horizons need 2 unit names, got 1");
  });
});
