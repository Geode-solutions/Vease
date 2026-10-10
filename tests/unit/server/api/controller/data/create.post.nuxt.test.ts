import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/data/create.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;

describe("the POST /api/controller/data/create endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("forwards validated params to the create-data command", async () => {
    const params = {
      kind: "curve",
      name: "loop",
      points: [
        [0, 0, 0],
        [1, 0, 0],
      ],
      closed: true,
    };
    const result = { id: "new-1", name: "loop" };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("create-data", params);
  });

  test("rejects a point that is not 3 numbers with 400", async () => {
    const event = eventWithBody({ kind: "point", name: "p", points: [[0, 0]] });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects an empty points list with 400", async () => {
    const event = eventWithBody({ kind: "point", name: "p", points: [] });

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
