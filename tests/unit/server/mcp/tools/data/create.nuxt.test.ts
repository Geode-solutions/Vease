import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/data/create";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

describe("create-data MCP tool", () => {
  test("posts to /api/controller/data/create and reports success", async () => {
    const input = { kind: "point" as const, name: "p", points: [[0, 0, 0]], closed: undefined };
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({ statusCode: 200, response: { id: "new-1", name: "p" } }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/data/create", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error creating data",
    });
    expect(result).toBe('Data created: {"id":"new-1","name":"p"}');
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error creating data: A surface needs at least 3 points"),
    );

    const result = await tool.handler(
      { kind: "surface", name: "s", points: [[0, 0, 0]], closed: undefined },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error creating data: A surface needs at least 3 points");
  });
});
