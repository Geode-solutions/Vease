import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  controllerUrl,
  jsonResponse,
  sentRequest,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import tool from "@vease_server/mcp/tools/data/manage";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";
const OTHER_ID = "fedcba9876543210fedcba9876543210";
const POINTS = [
  [0, 0, 0],
  [1, 0, 0],
];

type ToolInput = Parameters<typeof tool.handler>[0];

function toolInput(input: Pick<ToolInput, "action"> & Partial<ToolInput>): ToolInput {
  return {
    ids: undefined,
    name: undefined,
    kind: undefined,
    points: undefined,
    closed: undefined,
    ...input,
  };
}

describe("manage-data MCP tool", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("posts create to /api/controller/data/create and reports the new data", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { id: DATA_ID, name: "path" } }),
    );

    const result = await tool.handler(
      toolInput({ action: "create", kind: "curve", name: "path", points: POINTS, closed: true }),
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toStrictEqual({
      url: controllerUrl("data/create"),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { kind: "curve", name: "path", points: POINTS, closed: true },
    });
    expect(result).toBe(`Data managed (create): {"id":"${DATA_ID}","name":"path"}`);
  });

  test("posts rename to /api/controller/data/rename with the single id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ statusCode: 200, response: { id: DATA_ID } }));

    await tool.handler(
      toolInput({ action: "rename", ids: [DATA_ID], name: "renamed" }),
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toMatchObject({
      url: controllerUrl("data/rename"),
      body: { id: DATA_ID, name: "renamed" },
    });
  });

  test("posts delete to /api/controller/data/delete with every id", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { ids: [DATA_ID, OTHER_ID] } }),
    );

    const result = await tool.handler(
      toolInput({ action: "delete", ids: [DATA_ID, OTHER_ID] }),
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toMatchObject({
      url: controllerUrl("data/delete"),
      body: { ids: [DATA_ID, OTHER_ID] },
    });
    expect(result).toBe(`Data managed (delete): {"ids":["${DATA_ID}","${OTHER_ID}"]}`);
  });

  test.each([
    { case: "several ids", ids: [DATA_ID, OTHER_ID] },
    { case: "no id", ids: undefined },
  ])("rejects a rename with $case without calling the controller", async ({ ids }) => {
    const result = await tool.handler(
      toolInput({ action: "rename", ids, name: "renamed" }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error managing data: rename takes exactly one id");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([
    {
      reason: "a name to delete",
      input: { action: "delete" as const, ids: [DATA_ID], name: "renamed" },
      message: "Error managing data: name cannot be given to delete",
    },
    {
      reason: "points and closed to rename",
      input: {
        action: "rename" as const,
        ids: [DATA_ID],
        name: "renamed",
        points: POINTS,
        closed: true,
      },
      message: "Error managing data: points, closed cannot be given to rename",
    },
    {
      reason: "ids to create",
      input: { action: "create" as const, ids: [DATA_ID], kind: "point" as const, points: POINTS },
      message: "Error managing data: ids cannot be given to create",
    },
  ])("rejects $reason without calling the controller", async ({ input, message }) => {
    const result = await tool.handler(toolInput(input), fakeMcpRequestExtra());

    expect(result).toBe(message);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("forwards the controller error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ description: "No data with this id" }, { failed: true }),
    );

    const result = await tool.handler(
      toolInput({ action: "delete", ids: [DATA_ID] }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error managing data: No data with this id");
  });
});
