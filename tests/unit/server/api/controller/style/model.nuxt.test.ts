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
const POINT_SIZE = 4.5;
const COMPONENT_IDS = ["surface-1", "surface-2"];

// Every model style route but the attribute ones, with a valid value
const WHOLE_ROUTES: { route: string; value: StyleBody }[] = [
  { route: "model/visibility", value: { visibility: false } },
  { route: "model/points/size", value: { size: POINT_SIZE } },
  { route: "model/points/visibility", value: { visibility: true } },
  { route: "model/edges/visibility", value: { visibility: false } },
];
const COMPONENT_ROUTES: { route: string; value: StyleBody }[] = [
  { route: "model/corners/color", value: { color: "#ff8800" } },
  { route: "model/corners/coloring", value: { coloring: "random" } },
  { route: "model/corners/visibility", value: { visibility: true } },
  { route: "model/lines/color", value: { color: "#00ff0080" } },
  { route: "model/lines/coloring", value: { coloring: "constant" } },
  { route: "model/lines/visibility", value: { visibility: false } },
  { route: "model/surfaces/color", value: { color: "#0000ff" } },
  { route: "model/surfaces/coloring", value: { coloring: "random" } },
  { route: "model/surfaces/visibility", value: { visibility: true } },
  { route: "model/blocks/color", value: { color: "#abcdef" } },
  { route: "model/blocks/coloring", value: { coloring: "constant" } },
  { route: "model/blocks/visibility", value: { visibility: false } },
];
const ROUTES = [
  ...WHOLE_ROUTES,
  ...COMPONENT_ROUTES,
  ...COMPONENT_ROUTES.map(({ route, value }) => ({
    route,
    value: { componentIds: COMPONENT_IDS, ...value },
  })),
];

const VALUE_INVALID_BODIES: InvalidBody[] = [
  { route: "model/surfaces/color", reason: "a color name", body: { color: "red" } },
  { route: "model/lines/color", reason: "a 7-digit hex color", body: { color: "#ff88000" } },
  { route: "model/visibility", reason: "a numeric visibility", body: { visibility: 1 } },
  { route: "model/points/size", reason: "a zero size", body: { size: 0 } },
  { route: "model/edges/visibility", reason: "a width", body: { width: 1 } },
  { route: "model/blocks/coloring", reason: "a textures coloring", body: { coloring: "textures" } },
  {
    route: "model/corners/visibility",
    reason: "an empty componentIds list",
    body: { componentIds: [], visibility: true },
  },
  {
    route: "model/surfaces/coloring",
    reason: "a numeric component id",
    body: { componentIds: [1], coloring: "random" },
  },
].map(({ route, reason, body }) => ({ route, reason, body: { ids: [DATA_ID], ...body } }));

const INVALID_BODIES = [
  ...[...WHOLE_ROUTES, ...COMPONENT_ROUTES].flatMap(({ route, value }) =>
    commonInvalidBodies(route, value),
  ),
  // The whole model, its points and its edges have no components to pick
  ...WHOLE_ROUTES.map(({ route, value }) => ({
    route,
    reason: "componentIds",
    body: { ids: [DATA_ID], componentIds: COMPONENT_IDS, ...value },
  })),
  ...VALUE_INVALID_BODIES,
];

describe("the POST /api/controller/style/model/* endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("covers every model style route", () => {
    expect(styleRoutesOnDisk("model", { attribute: false })).toStrictEqual(
      [...WHOLE_ROUTES, ...COMPONENT_ROUTES].map(({ route }) => route).toSorted(),
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
