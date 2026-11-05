import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  controllerUrl,
  jsonResponse,
  sentRequest,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import tool from "@vease_server/mcp/tools/filter/apply";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";
const SHRINK_FACTOR = 0.8;
const SLICE_INDEX = 5;
const THRESHOLD_MAXIMUM = 10;

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
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test.each([
    { filter: "shrink" as const, params: { factor: SHRINK_FACTOR } },
    { filter: "explode" as const, params: { remove: true } },
    { filter: "slice" as const, params: { slices: [{ axis: 2 as const, index: SLICE_INDEX }] } },
    { filter: "clip" as const, params: { planes: [{ origin: [0, 0, 0], normal: [0, 0, 1] }] } },
    {
      filter: "threshold" as const,
      params: {
        attribute: "depth",
        location: "vertex" as const,
        item: 0,
        minimum: 1,
        maximum: THRESHOLD_MAXIMUM,
      },
    },
  ])(
    "posts $filter to /api/controller/filter/$filter without the filter",
    async ({ filter, params }) => {
      fetchMock.mockResolvedValue(jsonResponse({ statusCode: 200, response: { ids: [DATA_ID] } }));

      const result = await tool.handler(
        toolInput({ filter, ids: [DATA_ID], ...params }),
        fakeMcpRequestExtra(),
      );

      expect(sentRequest(fetchMock)).toStrictEqual({
        url: controllerUrl(`filter/${filter}`),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { ids: [DATA_ID], ...params },
      });
      expect(result).toBe(`Filter applied (${filter}): {"ids":["${DATA_ID}"]}`);
    },
  );

  test.each([
    {
      filter: "shrink" as const,
      params: { slices: [{ axis: 0 as const, index: 1 }] },
      message: "Error applying filter: slices cannot be given to shrink",
    },
    {
      filter: "clip" as const,
      params: { factor: SHRINK_FACTOR, attribute: "depth" },
      message: "Error applying filter: factor, attribute cannot be given to clip",
    },
    {
      filter: "threshold" as const,
      params: { attribute: "depth", planes: [] },
      message: "Error applying filter: planes cannot be given to threshold",
    },
  ])(
    "rejects params $filter does not take without calling the controller",
    async ({ filter, params, message }) => {
      const result = await tool.handler(
        toolInput({ filter, ids: [DATA_ID], ...params }),
        fakeMcpRequestExtra(),
      );

      expect(result).toBe(message);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  test("forwards the controller error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ description: "slice needs slices" }, { failed: true }),
    );

    const result = await tool.handler(
      toolInput({ filter: "slice", ids: [DATA_ID] }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error applying filter: slice needs slices");
  });
});
