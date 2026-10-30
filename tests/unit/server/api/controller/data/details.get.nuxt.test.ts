import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/data/details.get";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const DATA_ID = "0123456789abcdef0123456789abcdef";

function detailsEvent(id: string): ReturnType<typeof createMockEvent> {
  return createMockEvent({ method: "GET", url: `/api/controller/data/details?id=${id}` });
}

describe("the GET /api/controller/data/details endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("dispatches data-details with the requested id", async () => {
    const result = { id: DATA_ID, targets: ["points"] };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(handler(detailsEvent(DATA_ID))).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("data-details", { id: DATA_ID });
  });

  test("details rejects an id that is not 32 chars", async () => {
    const event = detailsEvent("too-short");

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
