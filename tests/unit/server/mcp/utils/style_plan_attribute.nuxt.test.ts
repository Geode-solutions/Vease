// oxlint-disable max-lines
// Third party imports
import { describe, expect, test, vi } from "vitest";

// Local imports
import {
  MODEL,
  MODEL_ID,
  OTHER_SURFACE_ID,
  SOLID,
  SOLID_ID,
  SURFACE_ID,
  surfaceDetails,
} from "@vease_tests/unit/server/mcp/utils/style_fixtures";
import {
  type RouteCall,
  type StyleDetails,
  StylePlanError,
  type StyleRequest,
  mergeCalls,
} from "@vease_server/mcp/utils/style_plan_common";
import { attributeCall } from "@vease_server/mcp/utils/style_plan_attribute";

vi.setConfig({ testTimeout: 10_000 });

const RANGE_MAXIMUM = 100;
const TIME_STEP = 0.5;
const SURFACE = surfaceDetails();
const NO_OPTIONS = {
  item: undefined,
  colormap: undefined,
  minimum: undefined,
  maximum: undefined,
  timeStep: undefined,
  noDataColor: undefined,
};
const SURFACE_ATTRIBUTES =
  "points/vertex: depth, porosity; polygons/vertex: depth; polygons/polygon: depth, region";

type AttributeRequest = StyleRequest & { attribute: string };

const FOUND_CASES: {
  name: string;
  details: StyleDetails;
  request: AttributeRequest;
  route: string;
}[] = [
  {
    name: "the polygon attribute before the same-name vertex one",
    details: SURFACE,
    request: { attribute: "depth" },
    route: "mesh/polygons/polygon/attribute",
  },
  {
    name: "the polygons vertex attribute before the points one, given the location",
    details: SURFACE,
    request: { attribute: "depth", location: "vertex" },
    route: "mesh/polygons/vertex/attribute",
  },
  {
    name: "the points attribute, given the target",
    details: SURFACE,
    request: { attribute: "depth", target: "points" },
    route: "mesh/points/vertex/attribute",
  },
  {
    name: "a points-only attribute",
    details: SURFACE,
    request: { attribute: "porosity" },
    route: "mesh/points/vertex/attribute",
  },
  {
    name: "the polyhedra attribute before the points one",
    details: SOLID,
    request: { attribute: "depth" },
    route: "mesh/polyhedra/vertex/attribute",
  },
  {
    name: "the blocks attribute before the surfaces one, the target coming before the location",
    details: MODEL,
    request: { attribute: "depth" },
    route: "model/blocks/vertex/attribute",
  },
  {
    name: "the surfaces attribute, given the target",
    details: MODEL,
    request: { attribute: "depth", target: "surfaces" },
    route: "model/surfaces/polygon/attribute",
  },
  {
    name: "a lines edge attribute",
    details: MODEL,
    request: { attribute: "length" },
    route: "model/lines/edge/attribute",
  },
];

const ERROR_CASES: { details: StyleDetails; request: AttributeRequest; message: string }[] = [
  {
    details: SURFACE,
    request: { attribute: "depth", componentIds: ["surface-1"] },
    message: "componentIds only applies to model corners, lines, surfaces, blocks",
  },
  {
    details: MODEL,
    request: { attribute: "depth", componentIds: ["surface-1"] },
    message: "componentIds needs a target: corners, lines, surfaces or blocks",
  },
  {
    details: SURFACE,
    request: { attribute: "depth", target: "cells" },
    message: '"cells" is not available on "surface"; available: points, edges, polygons',
  },
  {
    details: MODEL,
    request: { attribute: "depth", target: "points", componentIds: ["surface-1"] },
    message: "Model points carry no attributes; color corners, lines, surfaces or blocks",
  },
  {
    details: SURFACE,
    request: { attribute: "pressure" },
    message: `Attribute "pressure" not found on "surface". Available: ${SURFACE_ATTRIBUTES}`,
  },
  {
    details: SURFACE,
    request: { attribute: "region", location: "vertex" },
    message: `Attribute "region" not found on "surface". Available: ${SURFACE_ATTRIBUTES}`,
  },
  {
    details: SURFACE,
    request: { attribute: "porosity", target: "polygons" },
    message: `Attribute "porosity" not found on "surface". Available: ${SURFACE_ATTRIBUTES}`,
  },
  {
    details: { ...SURFACE, attributes: [] },
    request: { attribute: "depth" },
    message: 'Attribute "depth" not found on "surface". Available: none',
  },
];

function routeCall(route: string, ids: string[], params: Record<string, unknown>): RouteCall {
  return { route: `/api/controller/style/${route}`, ids, params };
}

describe("the attribute plan of a data", () => {
  test.each(FOUND_CASES)("picks $name", ({ details, request, route }) => {
    expect(attributeCall(details, request)).toStrictEqual(
      routeCall(route, [details.id], {
        componentIds: undefined,
        name: request.attribute,
        ...NO_OPTIONS,
      }),
    );
  });

  test("passes the colormap options and the model componentIds to the route", () => {
    const options = {
      item: 1,
      colormap: "batlow",
      minimum: 0,
      maximum: RANGE_MAXIMUM,
      timeStep: TIME_STEP,
      noDataColor: "#00000000",
    };

    expect(
      attributeCall(MODEL, {
        attribute: "depth",
        target: "surfaces",
        componentIds: ["surface-1"],
        location: "polygon",
        ...options,
      }),
    ).toStrictEqual(
      routeCall("model/surfaces/polygon/attribute", [MODEL_ID], {
        componentIds: ["surface-1"],
        name: "depth",
        ...options,
      }),
    );
  });

  test.each(ERROR_CASES)(
    "refuses $request on $details.name: $message",
    ({ details, request, message }) => {
      expect(() => attributeCall(details, request)).toThrow(new StylePlanError(message));
    },
  );
});

describe("the merge of route calls", () => {
  test("merges the same change on several data into one call carrying every id", () => {
    expect(
      mergeCalls([
        routeCall("mesh/polygons/color", [SURFACE_ID], { color: "#ff8800" }),
        routeCall("mesh/polygons/color", [OTHER_SURFACE_ID], { color: "#ff8800" }),
        routeCall("mesh/polygons/color", [SOLID_ID], { color: "#ff8800" }),
      ]),
    ).toStrictEqual([
      routeCall("mesh/polygons/color", [SURFACE_ID, OTHER_SURFACE_ID, SOLID_ID], {
        color: "#ff8800",
      }),
    ]);
  });

  test("keeps different values and routes apart, in their first order", () => {
    const calls = [
      routeCall("mesh/polygons/visibility", [SURFACE_ID], { visibility: true }),
      routeCall("mesh/polygons/color", [SURFACE_ID], { color: "#d74242" }),
      routeCall("mesh/polygons/visibility", [OTHER_SURFACE_ID], { visibility: true }),
      routeCall("mesh/polygons/color", [OTHER_SURFACE_ID], { color: "#42d7d7" }),
      routeCall("mesh/visibility", [SOLID_ID], { visibility: true }),
    ];

    expect(mergeCalls(calls)).toStrictEqual([
      routeCall("mesh/polygons/visibility", [SURFACE_ID, OTHER_SURFACE_ID], { visibility: true }),
      routeCall("mesh/polygons/color", [SURFACE_ID], { color: "#d74242" }),
      routeCall("mesh/polygons/color", [OTHER_SURFACE_ID], { color: "#42d7d7" }),
      routeCall("mesh/visibility", [SOLID_ID], { visibility: true }),
    ]);
  });

  test("merges params that only differ by keys left undefined", () => {
    expect(
      mergeCalls([
        routeCall("model/surfaces/visibility", [MODEL_ID], {
          componentIds: undefined,
          visibility: false,
        }),
        routeCall("model/surfaces/visibility", [SOLID_ID], { visibility: false }),
      ]),
    ).toHaveLength(1);
  });

  test("leaves the given calls untouched", () => {
    const first = routeCall("mesh/color", [SURFACE_ID], { color: "#ff8800" });

    mergeCalls([first, routeCall("mesh/color", [OTHER_SURFACE_ID], { color: "#ff8800" })]);

    expect(first.ids).toStrictEqual([SURFACE_ID]);
  });
});
