import { beforeEach, describe, expect, test, vi } from "vitest";
import { createError, getResponseStatus } from "h3";
import { consola } from "consola";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import handler from "@vease_server/api/controller/data/list.get";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const SERVICE_UNAVAILABLE = 503;

function listEvent(): ReturnType<typeof createMockEvent> {
  return createMockEvent({ method: "GET", url: "/api/controller/data/list" });
}

describe("the GET /api/controller/data/list endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("dispatches list-data", async () => {
    const result = { data: [{ id: "mesh-1", name: "surface" }] };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(handler(listEvent())).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("list-data", {});
  });

  test("returns 503 when the bus has no subscriber", async () => {
    vi.mocked(dispatchCommand).mockRejectedValue(
      createError({
        statusCode: SERVICE_UNAVAILABLE,
        statusMessage: "Service Unavailable",
        message: "Vease is not ready (application not open or still launching)",
      }),
    );

    const event = listEvent();
    await expect(handler(event)).resolves.toMatchObject({
      code: SERVICE_UNAVAILABLE,
      description: "Vease is not ready (application not open or still launching)",
    });
    expect(getResponseStatus(event)).toBe(SERVICE_UNAVAILABLE);
  });
});
