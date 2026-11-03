import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/style/attribute.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const DATA_ID = "0123456789abcdef0123456789abcdef";
const RANGE_MAXIMUM = 100;
const TIME_STEP = 0.5;

describe("the POST /api/controller/style/attribute endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("forwards validated params to the color-by-attribute command", async () => {
    const params = {
      ids: [DATA_ID],
      target: "polygons",
      attribute: "depth",
      location: "polygon",
      item: 1,
      colormap: "batlow",
      minimum: 0,
      maximum: RANGE_MAXIMUM,
      timeStep: TIME_STEP,
      noDataColor: "#00000000",
    };
    const result = { ids: [DATA_ID], target: "polygons", attribute: "depth" };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("color-by-attribute", params);
  });

  test("forwards the minimal ids and attribute", async () => {
    const params = { ids: [DATA_ID], attribute: "depth" };
    vi.mocked(dispatchCommand).mockResolvedValue({});

    await handler(eventWithBody(params));

    expect(dispatchCommand).toHaveBeenCalledWith("color-by-attribute", params);
  });

  test("rejects a missing attribute with 400", async () => {
    const event = eventWithBody({ ids: [DATA_ID], target: "polygons" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a style param, which only style/set takes, with 400", async () => {
    const event = eventWithBody({ ids: [DATA_ID], attribute: "depth", color: "#ff8800" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects an unknown location with 400", async () => {
    const event = eventWithBody({ ids: [DATA_ID], attribute: "depth", location: "face" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a negative item with 400", async () => {
    const event = eventWithBody({ ids: [DATA_ID], attribute: "depth", item: -1 });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a malformed no-data color with 400", async () => {
    const event = eventWithBody({ ids: [DATA_ID], attribute: "depth", noDataColor: "black" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
