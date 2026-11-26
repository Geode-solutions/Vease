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
const HALF = 0.5;
const ABOVE_ONE = 1.5;
const BELOW_ZERO = -0.1;

// Every image style route, with a valid value
const ROUTES: { route: string; value: StyleBody }[] = [
  { route: "image/opacity", value: { opacity: HALF } },
  { route: "image/visibility", value: { visibility: false } },
];

const BOUND_OPACITIES = [0, 1];

const VALUE_INVALID_BODIES: InvalidBody[] = [
  { route: "image/opacity", reason: "an opacity above 1", body: { opacity: ABOVE_ONE } },
  { route: "image/opacity", reason: "a negative opacity", body: { opacity: BELOW_ZERO } },
  { route: "image/opacity", reason: "a string opacity", body: { opacity: "half" } },
  { route: "image/opacity", reason: "a color", body: { color: "#ff8800" } },
  { route: "image/visibility", reason: "a string visibility", body: { visibility: "yes" } },
  { route: "image/visibility", reason: "an opacity", body: { opacity: HALF } },
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

describe("the POST /api/controller/style/image/* endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("covers every image style route", () => {
    expect(styleRoutesOnDisk("image", { attribute: false })).toStrictEqual(
      ROUTES.map(({ route }) => route).toSorted(),
    );
    expect(styleRoutesOnDisk("image", { attribute: true })).toStrictEqual([]);
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

  test.each(BOUND_OPACITIES)("style/image/opacity accepts the bound %s", async (opacity) => {
    const handler = await loadStyleRoute("image/opacity");
    const params = { ids: [DATA_ID], opacity };
    vi.mocked(dispatchCommand).mockResolvedValue({ ids: [DATA_ID] });

    await expect(handler(eventWithBody(params))).resolves.toMatchObject({ statusCode: 200 });
    expect(dispatchCommand).toHaveBeenCalledExactlyOnceWith("style/image/opacity", params);
  });

  test.each(INVALID_BODIES)("style/$route rejects $reason with 400", async ({ route, body }) => {
    const handler = await loadStyleRoute(route);
    const event = eventWithBody(body);

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
