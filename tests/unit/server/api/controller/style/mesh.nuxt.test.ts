// Third party imports
import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { getResponseStatus } from "h3";

// Local imports
import {
  DATA_ID,
  type InvalidBody,
  OTHER_ID,
  type StyleBody,
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
const POINT_SIZE = 2.5;
const EDGE_WIDTH = 3;

// Every mesh style route but the attribute ones, with a valid value
const ROUTES: { route: string; value: StyleBody }[] = [
  { route: "mesh/color", value: { color: "#ff8800" } },
  { route: "mesh/visibility", value: { visibility: false } },
  { route: "mesh/points/color", value: { color: "#00ff00" } },
  { route: "mesh/points/size", value: { size: POINT_SIZE } },
  { route: "mesh/points/visibility", value: { visibility: true } },
  { route: "mesh/edges/color", value: { color: "#0000ff80" } },
  { route: "mesh/edges/visibility", value: { visibility: false } },
  { route: "mesh/edges/width", value: { width: EDGE_WIDTH } },
  { route: "mesh/cells/color", value: { color: "#123456" } },
  { route: "mesh/cells/coloring", value: { coloring: "textures" } },
  { route: "mesh/cells/visibility", value: { visibility: true } },
  { route: "mesh/polygons/color", value: { color: "#abcdef" } },
  { route: "mesh/polygons/coloring", value: { coloring: "constant" } },
  { route: "mesh/polygons/visibility", value: { visibility: false } },
  { route: "mesh/polyhedra/color", value: { color: "#fedcba" } },
  { route: "mesh/polyhedra/visibility", value: { visibility: true } },
];

const VALUE_INVALID_BODIES: InvalidBody[] = [
  { route: "mesh/color", reason: "a color name", body: { color: "orange" } },
  { route: "mesh/polygons/color", reason: "a 3-digit hex color", body: { color: "#f80" } },
  { route: "mesh/visibility", reason: "a string visibility", body: { visibility: "yes" } },
  { route: "mesh/points/size", reason: "a zero size", body: { size: 0 } },
  { route: "mesh/points/size", reason: "a negative size", body: { size: -1 } },
  { route: "mesh/edges/width", reason: "a zero width", body: { width: 0 } },
  { route: "mesh/cells/coloring", reason: "a random coloring", body: { coloring: "random" } },
  { route: "mesh/polygons/coloring", reason: "an unknown coloring", body: { coloring: "vertex" } },
  { route: "mesh/polygons/color", reason: "a visibility", body: { visibility: true } },
  { route: "mesh/points/visibility", reason: "a size", body: { size: POINT_SIZE } },
].map(({ route, reason, body }) => ({ route, reason, body: { ids: [DATA_ID], ...body } }));

const INVALID_BODIES = [
  ...ROUTES.flatMap(({ route, value }) => [
    ...commonInvalidBodies(route, value),
    {
      route,
      reason: "componentIds, which only model components take",
      body: { ids: [DATA_ID], componentIds: ["surface-1"], ...value },
    },
  ]),
  ...VALUE_INVALID_BODIES,
];

describe("the POST /api/controller/style/mesh/* endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("covers every mesh style route", () => {
    expect(styleRoutesOnDisk("mesh", { attribute: false })).toStrictEqual(
      ROUTES.map(({ route }) => route).toSorted(),
    );
  });

  test.each(ROUTES)(
    "style/$route forwards $value to the style/$route command",
    async ({ route, value }) => {
      const handler = await loadStyleRoute(route);
      const params = { ids: [DATA_ID, OTHER_ID], ...value };
      const result = { ids: [DATA_ID, OTHER_ID] };
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
