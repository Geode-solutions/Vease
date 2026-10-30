import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/filter/apply";

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

function toolInput(input: Pick<ToolInput, "filter" | "ids"> & Partial<ToolInput>): ToolInput {
  return {
    remove: undefined,
    factor: undefined,
    slices: undefined,
    planes: undefined,
    attribute: undefined,
    location: undefined,
    item: undefined,
    minimum: undefined,
    maximum: undefined,
    ...input,
  };
}

describe("apply-filter MCP tool", () => {
  test("posts to /api/controller/filter/apply and reports success", async () => {
    const input = toolInput({ filter: "shrink", ids: [DATA_ID] });
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({
        statusCode: 200,
        response: { filter: "shrink", ids: [DATA_ID], factor: 0.8 },
      }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/filter/apply", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error applying filter",
    });
    expect(result).toBe(`Filter applied: {"filter":"shrink","ids":["${DATA_ID}"],"factor":0.8}`);
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error applying filter: slice needs slices"),
    );

    const result = await tool.handler(
      toolInput({ filter: "slice", ids: [DATA_ID] }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error applying filter: slice needs slices");
  });
});
