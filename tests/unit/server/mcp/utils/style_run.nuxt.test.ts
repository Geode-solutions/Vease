// oxlint-disable max-lines
// Third party imports
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Local imports
import {
  MODEL,
  MODEL_ID,
  OTHER_SURFACE_ID,
  SURFACE_ID,
  detailsReads,
  fakeController,
  routeRequests,
  surfaceDetails,
} from "@vease_tests/unit/server/mcp/utils/style_fixtures";
import {
  jsonResponse,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import type { StyleRequest } from "@vease_server/mcp/utils/style_plan_common";
import { distinctHexColors } from "@vease_server/mcp/utils/distinct_colors";
import { runStyle } from "@vease_server/mcp/utils/style_run";

vi.setConfig({ testTimeout: 10_000 });

const DRAWN_COLORS = ["#d74242", "#42d7a5", "#7442d7"];

vi.mock(import("@vease_server/mcp/utils/distinct_colors"), () => ({
  distinctHexColors: vi.fn<(count: number) => string[]>((count) => DRAWN_COLORS.slice(0, count)),
}));

const UNKNOWN_ID = "99999999999999999999999999999999";
const SURFACE = surfaceDetails();
const OTHER_SURFACE = surfaceDetails(OTHER_SURFACE_ID, "other surface");
const DETAILS = [SURFACE, OTHER_SURFACE, MODEL];

const REQUEST_ERRORS: { ids: string[]; request: StyleRequest; error: string }[] = [
  {
    ids: [MODEL_ID, SURFACE_ID],
    request: { target: "surfaces", componentIds: ["surface-1"], visibility: false },
    error: "componentIds belong to one model: give a single id with them",
  },
  {
    ids: [SURFACE_ID],
    request: { attribute: "depth", visibility: true, color: "#ff8800" },
    error: "attribute cannot be combined with visibility, color; style in a separate call",
  },
  {
    ids: [SURFACE_ID],
    request: { color: "#ff8800", location: "vertex", colormap: "batlow" },
    error: "location, colormap: only for coloring by an attribute",
  },
  {
    ids: [SURFACE_ID],
    request: { target: "polygons" },
    error: "Nothing to change: give visibility, color, size, width, coloring or attribute",
  },
  {
    ids: [SURFACE_ID],
    request: { color: "#ff8800", coloring: "random" },
    error: 'Give either a color or coloring "random", not both',
  },
];

function styleUpdated(response: Record<string, unknown>): string {
  return `Style updated: ${JSON.stringify(response)}`;
}

describe("the style run", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
    fakeController(fetchMock, { details: DETAILS });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test.each(REQUEST_ERRORS)(
    "refuses $request before reading any data: $error",
    async ({ ids, request, error }) => {
      await expect(runStyle(ids, request)).resolves.toBe(`Error setting style: ${error}`);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  test("reads each data, then posts its route call as JSON", async () => {
    const result = await runStyle([SURFACE_ID], { target: "polygons", color: "#ff8800" });

    expect(detailsReads(fetchMock)).toStrictEqual([SURFACE_ID]);
    expect(fetchMock.mock.calls.at(-1)?.[1]).toStrictEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [SURFACE_ID], color: "#ff8800" }),
    });
    expect(routeRequests(fetchMock)).toStrictEqual([
      { route: "style/mesh/polygons/color", body: { ids: [SURFACE_ID], color: "#ff8800" } },
    ]);
    expect(result).toBe(styleUpdated({ ids: [SURFACE_ID], applied: ["color"] }));
  });

  test("sends one route call carrying every id for the same change", async () => {
    const result = await runStyle([SURFACE_ID, OTHER_SURFACE_ID], {
      target: "polygons",
      visibility: false,
      color: "#ff8800",
    });

    expect(routeRequests(fetchMock)).toStrictEqual([
      {
        route: "style/mesh/polygons/visibility",
        body: { ids: [SURFACE_ID, OTHER_SURFACE_ID], visibility: false },
      },
      {
        route: "style/mesh/polygons/color",
        body: { ids: [SURFACE_ID, OTHER_SURFACE_ID], color: "#ff8800" },
      },
    ]);
    expect(result).toBe(
      styleUpdated({ ids: [SURFACE_ID, OTHER_SURFACE_ID], applied: ["visibility", "color"] }),
    );
  });

  test("draws a distinct color for every mesh", async () => {
    await runStyle([SURFACE_ID, OTHER_SURFACE_ID], { target: "polygons", coloring: "random" });

    expect(distinctHexColors).toHaveBeenCalledWith(2);
    expect(routeRequests(fetchMock)).toStrictEqual([
      { route: "style/mesh/polygons/color", body: { ids: [SURFACE_ID], color: DRAWN_COLORS[0] } },
      {
        route: "style/mesh/polygons/color",
        body: { ids: [OTHER_SURFACE_ID], color: DRAWN_COLORS[1] },
      },
    ]);
  });

  test("reports a data it cannot read and styles the others", async () => {
    const result = await runStyle([UNKNOWN_ID, SURFACE_ID], { visibility: true });

    expect(routeRequests(fetchMock)).toStrictEqual([
      { route: "style/mesh/visibility", body: { ids: [SURFACE_ID], visibility: true } },
    ]);
    expect(result).toBe(
      styleUpdated({
        ids: [SURFACE_ID],
        applied: ["visibility"],
        failed: [{ id: UNKNOWN_ID, error: `Cannot read the data: No data with id ${UNKNOWN_ID}` }],
      }),
    );
  });

  test("reports unexpected data details", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ statusCode: 200, response: { id: SURFACE_ID } }));

    await expect(runStyle([SURFACE_ID], { visibility: true })).resolves.toBe(
      "Error setting style: Unexpected data details",
    );
  });

  test("reports a data the request cannot style and styles the others", async () => {
    const result = await runStyle([MODEL_ID, SURFACE_ID], { color: "#ff8800" });

    expect(result).toBe(
      styleUpdated({
        ids: [SURFACE_ID],
        applied: ["color"],
        failed: [
          {
            id: MODEL_ID,
            error:
              "Give a target to style a model: points, edges, corners, lines, surfaces or blocks",
          },
        ],
      }),
    );
  });

  test("reports the ids a route call failed for", async () => {
    fakeController(fetchMock, {
      details: DETAILS,
      routes: {
        "style/mesh/polygons/color": ({ ids }) =>
          jsonResponse({
            statusCode: 200,
            response: { ids: ids.slice(0, 1), failed: [{ id: OTHER_SURFACE_ID, error: "gone" }] },
          }),
      },
    });

    const result = await runStyle([SURFACE_ID, OTHER_SURFACE_ID], {
      target: "polygons",
      color: "#ff8800",
    });

    expect(result).toBe(
      styleUpdated({
        ids: [SURFACE_ID],
        applied: ["color"],
        failed: [{ id: OTHER_SURFACE_ID, error: "gone" }],
      }),
    );
  });

  test("fails every id of a rejected route call and keeps running the others", async () => {
    fakeController(fetchMock, {
      details: DETAILS,
      routes: {
        "style/model/visibility": () =>
          jsonResponse({ description: "Viewer not ready" }, { failed: true }),
      },
    });

    const result = await runStyle([MODEL_ID, SURFACE_ID], { visibility: false });

    expect(routeRequests(fetchMock).map(({ route }) => route)).toStrictEqual([
      "style/model/visibility",
      "style/mesh/visibility",
    ]);
    expect(result).toBe(
      styleUpdated({
        ids: [SURFACE_ID],
        applied: ["visibility"],
        failed: [{ id: MODEL_ID, error: "style/model/visibility: Viewer not ready" }],
      }),
    );
  });

  test("returns an error, each message once, when no data is styled", async () => {
    fakeController(fetchMock, {
      details: DETAILS,
      routes: {
        "style/mesh/polygons/color": () =>
          jsonResponse({ description: "Viewer not ready" }, { failed: true }),
      },
    });

    const result = await runStyle([SURFACE_ID, OTHER_SURFACE_ID, UNKNOWN_ID], {
      target: "polygons",
      color: "#ff8800",
    });

    expect(result).toBe(
      `Error setting style: Cannot read the data: No data with id ${UNKNOWN_ID}; ` +
        "style/mesh/polygons/color: Viewer not ready",
    );
  });

  test("gathers the attributes colored by every route call", async () => {
    fakeController(fetchMock, {
      details: DETAILS,
      routes: {
        "style/mesh/polygons/polygon/attribute": ({ ids }) =>
          jsonResponse({ statusCode: 200, response: { ids, attributes: [{ id: SURFACE_ID }] } }),
        "style/model/blocks/vertex/attribute": ({ ids }) =>
          jsonResponse({ statusCode: 200, response: { ids, attributes: [{ id: MODEL_ID }] } }),
      },
    });

    const result = await runStyle([SURFACE_ID, MODEL_ID], {
      attribute: "depth",
      colormap: "batlow",
    });

    expect(routeRequests(fetchMock)).toStrictEqual([
      {
        route: "style/mesh/polygons/polygon/attribute",
        body: { ids: [SURFACE_ID], name: "depth", colormap: "batlow" },
      },
      {
        route: "style/model/blocks/vertex/attribute",
        body: { ids: [MODEL_ID], name: "depth", colormap: "batlow" },
      },
    ]);
    expect(result).toBe(
      styleUpdated({
        ids: [SURFACE_ID, MODEL_ID],
        attributes: [{ id: SURFACE_ID }, { id: MODEL_ID }],
      }),
    );
  });
});
