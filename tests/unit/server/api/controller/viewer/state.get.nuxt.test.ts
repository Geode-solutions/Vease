import { describe, expect, test, vi } from "vitest";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import handler from "@vease_server/api/controller/viewer/state.get";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

describe("the GET /api/controller/viewer/state endpoint", () => {
  test("dispatches viewer-state", async () => {
    const result = { zScaling: 1, cameraPositions: [], orientations: ["xplus"] };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(
      handler(createMockEvent({ method: "GET", url: "/api/controller/viewer/state" })),
    ).resolves.toStrictEqual({ statusCode: 200, response: result });
    expect(dispatchCommand).toHaveBeenCalledWith("viewer-state", {});
  });
});
