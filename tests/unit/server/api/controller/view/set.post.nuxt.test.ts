import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/view/set.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;

describe("the POST /api/controller/view/set endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("forwards validated params to the set-view command", async () => {
    const params = { action: "orient", orientation: "zplus" };
    const result = { action: "orient", orientation: "zplus" };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("set-view", params);
  });

  test("rejects an unknown action with 400", async () => {
    const event = eventWithBody({ action: "spin" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects an unknown orientation with 400", async () => {
    const event = eventWithBody({ action: "orient", orientation: "up" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a malformed background color with 400", async () => {
    const event = eventWithBody({ action: "scene", backgroundColor: "orange" });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
