import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockEvent, eventWithBody } from "@vease_tests/utils/server_utils";
import { consola } from "consola";
import create from "@vease_server/api/controller/horizon_stack/create.post";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { getResponseStatus } from "h3";
import info from "@vease_server/api/controller/horizon_stack/info.get";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const STACK_ID = "0123456789abcdef0123456789abcdef";

describe("the horizon stack controller routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("create dispatches create-horizon-stack with the stack", async () => {
    const params = { name: "stack", horizons: ["Top"], unit_names: ["A", "B"] };
    const result = { id: STACK_ID, name: "stack" };
    vi.mocked(dispatchCommand).mockResolvedValue(result);

    await expect(create(eventWithBody(params))).resolves.toStrictEqual({
      statusCode: 200,
      response: result,
    });
    expect(dispatchCommand).toHaveBeenCalledWith("create-horizon-stack", params);
  });

  test("create rejects a stack without horizons", async () => {
    const event = eventWithBody({ name: "stack", horizons: [] });

    await expect(create(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("create rejects duplicate horizon names", async () => {
    const event = eventWithBody({ name: "stack", horizons: ["Top", "Top"] });

    await expect(create(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("info dispatches horizon-stack-info with the requested id", async () => {
    const result = { horizons: [], units: [] };
    vi.mocked(dispatchCommand).mockResolvedValue(result);
    const event = createMockEvent({
      method: "GET",
      url: `/api/controller/horizon_stack/info?id=${STACK_ID}`,
    });

    await expect(info(event)).resolves.toStrictEqual({ statusCode: 200, response: result });
    expect(dispatchCommand).toHaveBeenCalledWith("horizon-stack-info", { id: STACK_ID });
  });
});
