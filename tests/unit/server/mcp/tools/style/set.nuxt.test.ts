import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/style/set";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";

type ToolInput = Parameters<typeof tool.handler>[0];

function toolInput(input: Pick<ToolInput, "id"> & Partial<ToolInput>): ToolInput {
  return {
    target: undefined,
    componentIds: undefined,
    visibility: undefined,
    color: undefined,
    size: undefined,
    width: undefined,
    coloring: undefined,
    ...input,
  };
}

describe("set-style MCP tool", () => {
  test("posts to /api/controller/style/set and reports success", async () => {
    const input = toolInput({ id: DATA_ID, target: "polygons", color: "#ff8800" });
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({ statusCode: 200, response: { id: DATA_ID, applied: ["color"] } }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/style/set", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error setting style",
    });
    expect(result).toBe(`Style updated: {"id":"${DATA_ID}","applied":["color"]}`);
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error setting style: Nothing to change"),
    );

    const result = await tool.handler(toolInput({ id: DATA_ID }), fakeMcpRequestExtra());

    expect(result).toBe("Error setting style: Nothing to change");
  });
});
