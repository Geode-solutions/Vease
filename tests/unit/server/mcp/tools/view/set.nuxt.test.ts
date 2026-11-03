import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  controllerUrl,
  jsonResponse,
  sentRequest,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import tool from "@vease_server/mcp/tools/view/set";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";
const POSITION_ID = 7;
const Z_SCALING = 2.5;

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
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test.each([
    { action: "reset" as const, params: {} },
    { action: "focus" as const, params: { id: DATA_ID, componentIds: ["corner-1"] } },
    { action: "orient" as const, params: { orientation: "zplus" as const } },
    { action: "save" as const, params: { name: "top" } },
    { action: "restore" as const, params: { positionId: POSITION_ID } },
    {
      action: "scene" as const,
      params: { zScaling: Z_SCALING, backgroundColor: "#202020", axes: true, grid: false },
    },
  ])(
    "posts $action to /api/controller/view/$action without the action",
    async ({ action, params }) => {
      fetchMock.mockResolvedValue(jsonResponse({ statusCode: 200, response: { action } }));

      const result = await tool.handler(toolInput({ action, ...params }), fakeMcpRequestExtra());

      expect(sentRequest(fetchMock)).toStrictEqual({
        url: controllerUrl(`view/${action}`),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: params,
      });
      expect(result).toBe(`View updated (${action}): {"action":"${action}"}`);
    },
  );

  test.each([
    {
      action: "reset" as const,
      params: { id: DATA_ID },
      message: "Error setting view: id cannot be given to reset",
    },
    {
      action: "orient" as const,
      params: { orientation: "zplus" as const, zScaling: Z_SCALING },
      message: "Error setting view: zScaling cannot be given to orient",
    },
    {
      action: "scene" as const,
      params: { name: "top", positionId: POSITION_ID, axes: true },
      message: "Error setting view: name, positionId cannot be given to scene",
    },
  ])(
    "rejects params $action does not take without calling the controller",
    async ({ action, params, message }) => {
      const result = await tool.handler(toolInput({ action, ...params }), fakeMcpRequestExtra());

      expect(result).toBe(message);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  test("forwards the controller error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ description: "No camera position with this id" }, { failed: true }),
    );

    const result = await tool.handler(
      toolInput({ action: "restore", positionId: POSITION_ID }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error setting view: No camera position with this id");
  });
});
