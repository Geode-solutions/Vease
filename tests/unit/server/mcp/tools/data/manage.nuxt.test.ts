import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/data/manage";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";

describe("manage-data MCP tool", () => {
  test("posts to /api/controller/data/manage and reports success", async () => {
    const input = { action: "delete" as const, id: DATA_ID, name: undefined };
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({ statusCode: 200, response: { id: DATA_ID, action: "delete" } }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/data/manage", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error managing data",
    });
    expect(result).toBe(`Data managed: {"id":"${DATA_ID}","action":"delete"}`);
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(errResult("Error managing data: no name"));

    const result = await tool.handler(
      { action: "rename", id: DATA_ID, name: undefined },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error managing data: no name");
  });
});
