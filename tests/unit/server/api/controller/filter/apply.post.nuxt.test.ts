import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/filter/apply.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const DATA_ID = "0123456789abcdef0123456789abcdef";

describe("the POST /api/controller/filter/apply endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("forwards validated params to the apply-filter command", async () => {
    const params = {
      filter: "clip",
      ids: [DATA_ID],
      planes: [{ origin: [0, 0, 0], normal: [0, 0, 1] }],
    };
    const result = { filter: "clip", ids: [DATA_ID] };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("apply-filter", params);
  });

  test("rejects an unknown filter with 400", async () => {
    const event = eventWithBody({ filter: "blur", ids: [DATA_ID] });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects an empty id list with 400", async () => {
    const event = eventWithBody({ filter: "shrink", ids: [] });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a slice with an invalid axis with 400", async () => {
    const event = eventWithBody({
      filter: "slice",
      ids: [DATA_ID],
      slices: [{ axis: 3, index: 1 }],
    });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
