import { beforeEach, describe, expect, test, vi } from "vitest";
import clip from "@vease_server/api/controller/filter/clip.post";
import { consola } from "consola";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import explode from "@vease_server/api/controller/filter/explode.post";
import { getResponseStatus } from "h3";
import shrink from "@vease_server/api/controller/filter/shrink.post";
import slice from "@vease_server/api/controller/filter/slice.post";
import threshold from "@vease_server/api/controller/filter/threshold.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const DATA_ID = "0123456789abcdef0123456789abcdef";
const SHRINK_FACTOR = 0.8;
const EXPLODE_FACTOR = 0.2;
const SLICE_INDEX = 5;
const AXIS_OUT_OF_RANGE = 3;
const THRESHOLD_MAXIMUM = 10;

const ROUTES = [
  {
    route: "shrink",
    handler: shrink,
    command: "apply-shrink",
    params: { ids: [DATA_ID], factor: SHRINK_FACTOR },
  },
  {
    route: "explode",
    handler: explode,
    command: "apply-explode",
    params: { ids: [DATA_ID], factor: EXPLODE_FACTOR },
  },
  {
    route: "slice",
    handler: slice,
    command: "apply-slice",
    params: { ids: [DATA_ID], slices: [{ axis: 2, index: SLICE_INDEX }] },
  },
  {
    route: "clip",
    handler: clip,
    command: "apply-clip",
    params: { ids: [DATA_ID], planes: [{ origin: [0, 0, 0], normal: [0, 0, 1] }] },
  },
  {
    route: "threshold",
    handler: threshold,
    command: "apply-threshold",
    params: {
      ids: [DATA_ID],
      attribute: "depth",
      location: "vertex",
      item: 0,
      minimum: 1,
      maximum: THRESHOLD_MAXIMUM,
    },
  },
  {
    route: "shrink",
    handler: shrink,
    command: "apply-shrink",
    params: { ids: [DATA_ID], remove: true },
  },
];

const INVALID_BODIES = [
  { route: "shrink", handler: shrink, reason: "an empty ids list", body: { ids: [] } },
  { route: "shrink", handler: shrink, reason: "no ids", body: { factor: SHRINK_FACTOR } },
  {
    route: "explode",
    handler: explode,
    reason: "a negative factor",
    body: { ids: [DATA_ID], factor: -1 },
  },
  {
    route: "explode",
    handler: explode,
    reason: "a stray filter",
    body: { filter: "explode", ids: [DATA_ID] },
  },
  {
    route: "slice",
    handler: slice,
    reason: "an invalid axis",
    body: { ids: [DATA_ID], slices: [{ axis: AXIS_OUT_OF_RANGE, index: 1 }] },
  },
  {
    route: "slice",
    handler: slice,
    reason: "a factor, which only shrink and explode take",
    body: { ids: [DATA_ID], factor: SHRINK_FACTOR },
  },
  {
    route: "clip",
    handler: clip,
    reason: "a plane without a normal",
    body: { ids: [DATA_ID], planes: [{ origin: [0, 0, 0] }] },
  },
  {
    route: "threshold",
    handler: threshold,
    reason: "an unknown location",
    body: { ids: [DATA_ID], attribute: "depth", location: "face" },
  },
];

describe("the POST /api/controller/filter/* endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test.each(ROUTES)(
    "filter/$route forwards $params to the $command command",
    async ({ handler, command, params }) => {
      const result = { ids: [DATA_ID] };
      vi.mocked(dispatchCommand).mockResolvedValue(result);

      await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
        statusCode: 200,
        response: result,
      });
      expect(dispatchCommand).toHaveBeenCalledWith(command, params);
    },
  );

  test.each(INVALID_BODIES)("filter/$route rejects $reason with 400", async ({ handler, body }) => {
    const event = eventWithBody(body);

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
