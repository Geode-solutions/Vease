import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/view/set";

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

function toolInput(input: Pick<ToolInput, "action"> & Partial<ToolInput>): ToolInput {
  return {
    id: undefined,
    componentIds: undefined,
    orientation: undefined,
    name: undefined,
    positionId: undefined,
    zScaling: undefined,
    backgroundColor: undefined,
    axes: undefined,
    grid: undefined,
    ...input,
  };
}

describe("set-view MCP tool", () => {
  test("posts to /api/controller/view/set and reports success", async () => {
    const input = toolInput({ action: "focus", id: DATA_ID });
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({ statusCode: 200, response: { action: "focus", id: DATA_ID } }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/view/set", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error setting view",
    });
    expect(result).toBe(`View updated: {"action":"focus","id":"${DATA_ID}"}`);
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error setting view: orient needs orientation"),
    );

    const result = await tool.handler(toolInput({ action: "orient" }), fakeMcpRequestExtra());

    expect(result).toBe("Error setting view: orient needs orientation");
  });
});
