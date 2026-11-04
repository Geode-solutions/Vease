// Third party imports
import { describe, expect, test, vi } from "vitest";

// Local imports
import {
  MODEL,
  MODEL_ID,
  SOLID,
  SOLID_ID,
  SURFACE_ID,
  surfaceDetails,
} from "@vease_tests/unit/server/mcp/utils/style_fixtures";
import {
  type StyleDetails,
  StylePlanError,
  type StyleRequest,
  givenProperties,
  styleCalls,
} from "@vease_server/mcp/utils/style_plan";

vi.setConfig({ testTimeout: 10_000 });

const RANDOM_COLOR = "#d74242";
const SIZE = 2.5;
const SURFACE = surfaceDetails();
const MODEL_WITHOUT_BLOCKS: StyleDetails = {
  ...MODEL,
  targets: ["points", "edges", "corners", "lines", "surfaces"],
};
const TARGETS_HINT = "points, edges, corners, lines, surfaces or blocks";

function routeCall(
  id: string,
  route: string,
  params: Record<string, unknown>,
): { route: string; ids: string[]; params: Record<string, unknown> } {
  return { route: `/api/controller/style/${route}`, ids: [id], params };
}

const MESH_CASES: { name: string; details: StyleDetails; request: StyleRequest; calls: unknown }[] =
  [
    {
      name: "an element color",
      details: SURFACE,
      request: { target: "polygons", color: "#ff8800" },
      calls: [routeCall(SURFACE_ID, "mesh/polygons/color", { color: "#ff8800" })],
    },
    {
      name: "visibility, color and textures of an element, in that order",
      details: SURFACE,
      request: { target: "polygons", visibility: false, color: "#ff8800", coloring: "textures" },
      calls: [
        routeCall(SURFACE_ID, "mesh/polygons/visibility", { visibility: false }),
        routeCall(SURFACE_ID, "mesh/polygons/color", { color: "#ff8800" }),
        routeCall(SURFACE_ID, "mesh/polygons/coloring", { coloring: "textures" }),
      ],
    },
    {
      name: "a point size",
      details: SURFACE,
      request: { target: "points", visibility: true, size: SIZE },
      calls: [
        routeCall(SURFACE_ID, "mesh/points/visibility", { visibility: true }),
        routeCall(SURFACE_ID, "mesh/points/size", { size: SIZE }),
      ],
    },
    {
      name: "an edge width",
      details: SURFACE,
      request: { target: "edges", width: 2 },
      calls: [routeCall(SURFACE_ID, "mesh/edges/width", { width: 2 })],
    },
    {
      name: "a constant coloring of polygons, switched back from textures",
      details: SURFACE,
      request: { target: "polygons", coloring: "constant" },
      calls: [routeCall(SURFACE_ID, "mesh/polygons/coloring", { coloring: "constant" })],
    },
    {
      name: "a constant coloring of points, which is only their color",
      details: SURFACE,
      request: { target: "points", coloring: "constant", color: "#00ff00" },
      calls: [routeCall(SURFACE_ID, "mesh/points/color", { color: "#00ff00" })],
    },
    {
      name: "a random coloring of an element, as the color drawn for the mesh",
      details: SURFACE,
      request: { target: "polygons", coloring: "random" },
      calls: [routeCall(SURFACE_ID, "mesh/polygons/color", { color: RANDOM_COLOR })],
    },
    {
      name: "a polyhedra color",
      details: SOLID,
      request: { target: "polyhedra", color: "#0000ff" },
      calls: [routeCall(SOLID_ID, "mesh/polyhedra/color", { color: "#0000ff" })],
    },
    {
      name: "the whole mesh visibility",
      details: SURFACE,
      request: { visibility: false },
      calls: [routeCall(SURFACE_ID, "mesh/visibility", { visibility: false })],
    },
    {
      name: "the whole mesh color",
      details: SURFACE,
      request: { color: "#ff8800" },
      calls: [routeCall(SURFACE_ID, "mesh/color", { color: "#ff8800" })],
    },
    {
      name: "a random coloring of the whole mesh",
      details: SURFACE,
      request: { visibility: true, coloring: "random" },
      calls: [
        routeCall(SURFACE_ID, "mesh/visibility", { visibility: true }),
        routeCall(SURFACE_ID, "mesh/color", { color: RANDOM_COLOR }),
      ],
    },
  ];

const MODEL_CASES: { name: string; request: StyleRequest; calls: unknown }[] = [
  {
    name: "every surface of the model",
    request: { target: "surfaces", visibility: true, color: "#ff8800" },
    calls: [
      routeCall(MODEL_ID, "model/surfaces/visibility", {
        componentIds: undefined,
        visibility: true,
      }),
      routeCall(MODEL_ID, "model/surfaces/color", { componentIds: undefined, color: "#ff8800" }),
    ],
  },
  {
    name: "a random coloring of some blocks, done by the model route",
    request: { target: "blocks", componentIds: ["block-1"], coloring: "random" },
    calls: [
      routeCall(MODEL_ID, "model/blocks/coloring", {
        componentIds: ["block-1"],
        coloring: "random",
      }),
    ],
  },
  {
    name: "a constant coloring of the corners",
    request: { target: "corners", coloring: "constant" },
    calls: [
      routeCall(MODEL_ID, "model/corners/coloring", {
        componentIds: undefined,
        coloring: "constant",
      }),
    ],
  },
  {
    name: "the whole model visibility",
    request: { visibility: false },
    calls: [routeCall(MODEL_ID, "model/visibility", { visibility: false })],
  },
  {
    name: "the model points",
    request: { target: "points", visibility: true, size: SIZE },
    calls: [
      routeCall(MODEL_ID, "model/points/visibility", { visibility: true }),
      routeCall(MODEL_ID, "model/points/size", { size: SIZE }),
    ],
  },
  {
    name: "the model edges",
    request: { target: "edges", visibility: false },
    calls: [routeCall(MODEL_ID, "model/edges/visibility", { visibility: false })],
  },
];

const ERROR_CASES: { details: StyleDetails; request: StyleRequest; message: string }[] = [
  {
    details: SURFACE,
    request: { componentIds: ["surface-1"], visibility: true },
    message: "componentIds only applies to model corners, lines, surfaces, blocks",
  },
  {
    details: SURFACE,
    request: { target: "cells", color: "#ff8800" },
    message: '"cells" is not available on "surface"; available: points, edges, polygons',
  },
  {
    details: SURFACE,
    request: { target: "polygons", size: SIZE },
    message: "size cannot be set on mesh polygons",
  },
  {
    details: SURFACE,
    request: { target: "points", width: 1 },
    message: "width cannot be set on mesh points",
  },
  {
    details: SURFACE,
    request: { target: "edges", size: SIZE, width: 1 },
    message: "size cannot be set on mesh edges",
  },
  {
    details: SURFACE,
    request: { target: "edges", coloring: "textures" },
    message: 'coloring "textures" cannot be set on mesh edges',
  },
  {
    details: SURFACE,
    request: { target: "points", coloring: "constant" },
    message: "Give a color to set a constant coloring on mesh points",
  },
  {
    details: SURFACE,
    request: { visibility: true, size: SIZE, width: 1 },
    message: 'size, width cannot be set on the whole mesh "surface"',
  },
  {
    details: SURFACE,
    request: { coloring: "textures" },
    message: 'coloring cannot be set on the whole mesh "surface"',
  },
  {
    details: MODEL_WITHOUT_BLOCKS,
    request: { target: "blocks", visibility: false },
    message:
      '"blocks" is not available on "model"; available: points, edges, corners, lines, surfaces',
  },
  {
    details: MODEL,
    request: { target: "surfaces", size: SIZE },
    message: "size cannot be set on model surfaces",
  },
  {
    details: MODEL,
    request: { target: "lines", coloring: "textures" },
    message: 'coloring "textures" cannot be set on model lines',
  },
  {
    details: MODEL,
    request: { target: "points", componentIds: ["corner-1"], visibility: true },
    message: "componentIds only applies to model corners, lines, surfaces, blocks, not points",
  },
  {
    details: MODEL,
    request: { componentIds: ["corner-1"], visibility: true },
    message:
      "componentIds only applies to model corners, lines, surfaces, blocks, not the whole model",
  },
  {
    details: MODEL,
    request: { color: "#ff8800" },
    message: `Give a target to style a model: ${TARGETS_HINT}`,
  },
  {
    details: MODEL,
    request: { visibility: true, color: "#ff8800" },
    message: `Give a target to style a model: ${TARGETS_HINT}`,
  },
  {
    details: MODEL,
    request: { target: "polygons", visibility: true },
    message:
      '"polygons" is not a model target; use points, edges, corners, lines, surfaces, blocks',
  },
  {
    details: MODEL,
    request: { target: "edges", size: SIZE },
    message: "size cannot be set on model edges",
  },
  {
    details: MODEL,
    request: { target: "points", color: "#ff8800" },
    message: "color cannot be set on model points",
  },
];

describe("the style plan of a data", () => {
  test.each(MESH_CASES)("plans $name on a mesh", ({ details, request, calls }) => {
    expect(styleCalls(details, request, RANDOM_COLOR)).toStrictEqual(calls);
  });

  test.each(MODEL_CASES)("plans $name", ({ request, calls }) => {
    expect(styleCalls(MODEL, request, RANDOM_COLOR)).toStrictEqual(calls);
  });

  test.each(ERROR_CASES)(
    "refuses $request on $details.name: $message",
    ({ details, request, message }) => {
      expect(() => styleCalls(details, request, RANDOM_COLOR)).toThrow(new StylePlanError(message));
    },
  );

  test("names its errors StylePlanError", () => {
    expect(() => styleCalls(MODEL, { color: "#ff8800" }, RANDOM_COLOR)).toThrow(
      expect.objectContaining({ name: "StylePlanError" }),
    );
  });

  test("lists the style properties given, false and random included", () => {
    expect(
      givenProperties({ visibility: false, coloring: "random", attribute: "depth", item: 0 }),
    ).toStrictEqual(["visibility", "coloring"]);
  });
});
