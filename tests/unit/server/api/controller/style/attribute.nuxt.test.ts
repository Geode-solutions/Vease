// Third party imports
import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { getResponseStatus } from "h3";

// Local imports
import {
  DATA_ID,
  type InvalidBody,
  OTHER_ID,
  commonInvalidBodies,
  loadStyleRoute,
  styleRoutesOnDisk,
} from "@vease_tests/unit/server/api/controller/style/style_routes";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const RANGE_MAXIMUM = 100;
const TIME_STEP = 0.5;

const MESH_ROUTES = [
  "mesh/points/vertex/attribute",
  "mesh/edges/edge/attribute",
  "mesh/edges/vertex/attribute",
  "mesh/cells/cell/attribute",
  "mesh/cells/vertex/attribute",
  "mesh/polygons/polygon/attribute",
  "mesh/polygons/vertex/attribute",
  "mesh/polyhedra/polyhedron/attribute",
  "mesh/polyhedra/vertex/attribute",
];
const MODEL_ROUTES = [
  "model/corners/vertex/attribute",
  "model/lines/edge/attribute",
  "model/lines/vertex/attribute",
  "model/surfaces/polygon/attribute",
  "model/surfaces/vertex/attribute",
  "model/blocks/polyhedron/attribute",
  "model/blocks/vertex/attribute",
];
const ALL_ROUTES = [...MESH_ROUTES, ...MODEL_ROUTES];

const NAME = { name: "depth" };
const OPTIONS = {
  item: 1,
  colormap: "batlow",
  minimum: 0,
  maximum: RANGE_MAXIMUM,
  timeStep: TIME_STEP,
  noDataColor: "#00000000",
};

const ROUTES = [
  ...ALL_ROUTES.map((route) => ({ route, value: NAME })),
  ...ALL_ROUTES.map((route) => ({ route, value: { ...NAME, ...OPTIONS } })),
  ...MODEL_ROUTES.map((route) => ({ route, value: { componentIds: ["block-1"], ...NAME } })),
];

const OPTION_INVALID_BODIES: InvalidBody[] = ALL_ROUTES.flatMap((route) => [
  { route, reason: "an empty name", body: { name: "" } },
  { route, reason: "a negative item", body: { ...NAME, item: -1 } },
  { route, reason: "a fractional item", body: { ...NAME, item: 0.5 } },
  { route, reason: "an empty colormap", body: { ...NAME, colormap: "" } },
  { route, reason: "a string minimum", body: { ...NAME, minimum: "0" } },
  { route, reason: "a malformed noDataColor", body: { ...NAME, noDataColor: "black" } },
  { route, reason: "a location, given by the route", body: { ...NAME, location: "vertex" } },
  { route, reason: "an attribute key instead of name", body: { attribute: "depth" } },
  { route, reason: "a color", body: { ...NAME, color: "#ff8800" } },
]).map(({ route, reason, body }) => ({ route, reason, body: { ids: [DATA_ID], ...body } }));

const INVALID_BODIES = [
  ...ALL_ROUTES.flatMap((route) => commonInvalidBodies(route, NAME)),
  ...MESH_ROUTES.map((route) => ({
    route,
    reason: "componentIds, which only model components take",
    body: { ids: [DATA_ID], componentIds: ["surface-1"], ...NAME },
  })),
  ...MODEL_ROUTES.map((route) => ({
    route,
    reason: "an empty componentIds list",
    body: { ids: [DATA_ID], componentIds: [], ...NAME },
  })),
  ...OPTION_INVALID_BODIES,
];

describe("the POST /api/controller/style/*/attribute endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("covers every attribute style route", () => {
    expect([
      ...styleRoutesOnDisk("mesh", { attribute: true }),
      ...styleRoutesOnDisk("model", { attribute: true }),
    ]).toStrictEqual([...MESH_ROUTES.toSorted(), ...MODEL_ROUTES.toSorted()]);
  });

  test.each(ROUTES)(
    "style/$route forwards $value to the style/$route command",
    async ({ route, value }) => {
      const handler = await loadStyleRoute(route);
      const params = { ids: [DATA_ID, OTHER_ID], ...value };
      const result = { ids: [DATA_ID, OTHER_ID], attributes: [] };
      vi.mocked(dispatchCommand).mockResolvedValue(result);

      await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
        statusCode: 200,
        response: result,
      });
      expect(dispatchCommand).toHaveBeenCalledExactlyOnceWith(`style/${route}`, params);
    },
  );

  test.each(INVALID_BODIES)("style/$route rejects $reason with 400", async ({ route, body }) => {
    const handler = await loadStyleRoute(route);
    const event = eventWithBody(body);

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
