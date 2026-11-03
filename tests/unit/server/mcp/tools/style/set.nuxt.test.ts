import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  controllerUrl,
  jsonResponse,
  sentRequest,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import tool from "@vease_server/mcp/tools/style/set";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";
const RANGE_MAXIMUM = 100;

type ToolInput = Parameters<typeof tool.handler>[0];

function toolInput(input: Pick<ToolInput, "ids"> & Partial<ToolInput>): ToolInput {
  return {
    target: undefined,
    componentIds: undefined,
    visibility: undefined,
    color: undefined,
    size: undefined,
    width: undefined,
    coloring: undefined,
    attribute: undefined,
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

describe("set-style MCP tool", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("posts a style change to /api/controller/style/set and reports success", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { ids: [DATA_ID], applied: ["color"] } }),
    );

    const result = await tool.handler(
      toolInput({ ids: [DATA_ID], target: "polygons", color: "#ff8800" }),
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toStrictEqual({
      url: controllerUrl("style/set"),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { ids: [DATA_ID], target: "polygons", color: "#ff8800" },
    });
    expect(result).toBe(`Style updated: {"ids":["${DATA_ID}"],"applied":["color"]}`);
  });

  test("posts to /api/controller/style/attribute when an attribute is given", async () => {
    const attributeParams = {
      ids: [DATA_ID],
      target: "polygons" as const,
      componentIds: ["surface-1"],
      attribute: "depth",
      location: "polygon" as const,
      colormap: "batlow",
      minimum: 0,
      maximum: RANGE_MAXIMUM,
    };
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { ids: [DATA_ID], attribute: "depth" } }),
    );

    const result = await tool.handler(toolInput(attributeParams), fakeMcpRequestExtra());

    expect(sentRequest(fetchMock)).toMatchObject({
      url: controllerUrl("style/attribute"),
      body: attributeParams,
    });
    expect(result).toBe(`Style updated: {"ids":["${DATA_ID}"],"attribute":"depth"}`);
  });

  test("rejects style params given with an attribute without calling the controller", async () => {
    const result = await tool.handler(
      toolInput({ ids: [DATA_ID], attribute: "depth", color: "#ff8800", visibility: true }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe(
      "Error coloring by attribute: visibility, color cannot be given with attribute; " +
        "style in a separate call",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("rejects attribute params given without an attribute without calling the controller", async () => {
    const result = await tool.handler(
      toolInput({ ids: [DATA_ID], colormap: "batlow" }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe(
      "Error setting style: colormap cannot be given without attribute; they only apply when " +
        "coloring by an attribute",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("forwards the controller error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ description: "Nothing to change" }, { failed: true }),
    );

    const result = await tool.handler(toolInput({ ids: [DATA_ID] }), fakeMcpRequestExtra());

    expect(result).toBe("Error setting style: Nothing to change");
  });
});
