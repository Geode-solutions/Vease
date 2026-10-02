import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockEvent, eventWithBody } from "@vease_tests/utils/server_utils";
import { consola } from "consola";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/llm/kill.post";
import { stopLlamaServer } from "@vease_server/utils/llama_cpp";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  stopLlamaServer: vi.fn<typeof stopLlamaServer>(),
}));

const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

describe("the POST /api/llm/kill endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("stops the llama server and returns 200", async () => {
    const result = await handler(createMockEvent({ method: "POST" }));

    expect(stopLlamaServer).toHaveBeenCalledWith();
    expect(result).toStrictEqual({ statusCode: 200 });
  });

  test("returns a 400 error response when the body has unexpected properties", async () => {
    const event = eventWithBody({ unexpected: true });

    await expect(handler(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      name: "Bad Request",
    });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(stopLlamaServer).not.toHaveBeenCalled();
  });

  test("turns a failure into a 500 error response", async () => {
    vi.mocked(stopLlamaServer).mockImplementation(() => {
      throw new Error("no process to kill");
    });

    const event = createMockEvent({ method: "POST" });
    await expect(handler(event)).resolves.toStrictEqual({
      code: INTERNAL_SERVER_ERROR,
      name: "Internal Server Error",
      description: "no process to kill",
    });
    expect(getResponseStatus(event)).toBe(INTERNAL_SERVER_ERROR);
  });
});
