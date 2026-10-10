import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/style/color_by_attribute";

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

function toolInput(input: Pick<ToolInput, "id" | "attribute"> & Partial<ToolInput>): ToolInput {
  return {
    target: undefined,
    componentIds: undefined,
    location: undefined,
    item: undefined,
    colormap: undefined,
    minimum: undefined,
    maximum: undefined,
    timeStep: undefined,
    noDataColor: undefined,
    ...input,
  };
}

describe("color-by-attribute MCP tool", () => {
  test("posts to /api/controller/style/attribute and reports success", async () => {
    const input = toolInput({ id: DATA_ID, attribute: "depth" });
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({ statusCode: 200, response: { id: DATA_ID, attribute: "depth" } }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/style/attribute", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error coloring by attribute",
    });
    expect(result).toBe(`Colored by attribute: {"id":"${DATA_ID}","attribute":"depth"}`);
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult('Error coloring by attribute: Attribute "depth" not found'),
    );

    const result = await tool.handler(
      toolInput({ id: DATA_ID, attribute: "depth" }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe('Error coloring by attribute: Attribute "depth" not found');
  });
});
