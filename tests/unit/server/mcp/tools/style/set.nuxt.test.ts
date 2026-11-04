// Third party imports
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Local imports
import {
  OTHER_SURFACE_ID,
  SURFACE_ID,
  THIRD_SURFACE_ID,
  fakeController,
  routeRequests,
  surfaceDetails,
} from "@vease_tests/unit/server/mcp/utils/style_fixtures";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import {
  jsonResponse,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import tool from "@vease_server/mcp/tools/style/set";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

const HEX = /^#[0-9a-f]{6}$/u;
const SURFACE_IDS = [SURFACE_ID, OTHER_SURFACE_ID, THIRD_SURFACE_ID];
const DETAILS = [
  surfaceDetails(SURFACE_ID, "top"),
  surfaceDetails(OTHER_SURFACE_ID, "middle"),
  surfaceDetails(THIRD_SURFACE_ID, "bottom"),
];

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

function sentColor({ body }: { body: unknown }): string {
  if (typeof body === "object" && body !== null && "color" in body) {
    return String(body.color);
  }
  return "";
}

describe("set-style MCP tool", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
    fakeController(fetchMock, { details: DETAILS });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("gives each surface its own random color through the polygons color route", async () => {
    const result = await tool.handler(
      toolInput({ ids: SURFACE_IDS, target: "polygons", coloring: "random" }),
      fakeMcpRequestExtra(),
    );

    const requests = routeRequests(fetchMock);
    const colors = requests.map((request) => sentColor(request));

    expect(requests).toStrictEqual(
      SURFACE_IDS.map((id, index) => ({
        route: "style/mesh/polygons/color",
        body: { ids: [id], color: colors[index] },
      })),
    );
    expect(colors.every((color) => HEX.test(color))).toBe(true);
    expect(new Set(colors).size).toBe(SURFACE_IDS.length);
    expect(result).toBe(
      `Style updated: ${JSON.stringify({ ids: SURFACE_IDS, applied: ["coloring"] })}`,
    );
  });

  test("colors by an attribute found without target", async () => {
    const attributes = [{ id: SURFACE_ID, target: "polygons", location: "polygon", name: "depth" }];
    fakeController(fetchMock, {
      details: DETAILS,
      routes: {
        "style/mesh/polygons/polygon/attribute": ({ ids }) =>
          jsonResponse({ statusCode: 200, response: { ids, attributes } }),
      },
    });

    const result = await tool.handler(
      toolInput({ ids: [SURFACE_ID], attribute: "depth", colormap: "batlow" }),
      fakeMcpRequestExtra(),
    );

    expect(routeRequests(fetchMock)).toStrictEqual([
      {
        route: "style/mesh/polygons/polygon/attribute",
        body: { ids: [SURFACE_ID], name: "depth", colormap: "batlow" },
      },
    ]);
    expect(result).toBe(`Style updated: ${JSON.stringify({ ids: [SURFACE_ID], attributes })}`);
  });

  test("passes the controller error through", async () => {
    fakeController(fetchMock, {
      details: DETAILS,
      routes: {
        "style/mesh/edges/width": () =>
          jsonResponse({ description: "Viewer not ready" }, { failed: true }),
      },
    });

    const result = await tool.handler(
      toolInput({ ids: [SURFACE_ID], target: "edges", width: 2 }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error setting style: style/mesh/edges/width: Viewer not ready");
  });

  test("passes a plan error through", async () => {
    const result = await tool.handler(
      toolInput({ ids: [SURFACE_ID], target: "polygons", size: 2 }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error setting style: size cannot be set on mesh polygons");
    expect(routeRequests(fetchMock)).toStrictEqual([]);
  });

  test("refuses a request error without calling the controller", async () => {
    const result = await tool.handler(
      toolInput({ ids: [SURFACE_ID], colormap: "batlow" }),
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error setting style: colormap: only for coloring by an attribute");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
