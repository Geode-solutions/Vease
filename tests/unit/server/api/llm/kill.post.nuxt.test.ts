import { afterEach, describe, expect, test, vi } from "vitest";
import { createMockEvent } from "@vease_tests/server_utils";
import handler from "@vease_server/api/llm/kill.post";
import { stopLlamaServer } from "@vease_server/utils/llama_cpp";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  stopLlamaServer: vi.fn<typeof stopLlamaServer>(),
}));

describe("the POST /api/llm/kill endpoint", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  test("stops the llama server and returns 200", () => {
    const result = handler(createMockEvent({ method: "POST" }));

    expect(stopLlamaServer).toHaveBeenCalledWith();
    expect(result).toStrictEqual({ statusCode: 200 });
  });

  test("wraps a failure into a 500 h3 error", () => {
    vi.mocked(stopLlamaServer).mockImplementation(() => {
      throw new Error("no process to kill");
    });

    expect(() => handler(createMockEvent({ method: "POST" }))).toThrow(
      expect.objectContaining({ statusCode: 500, statusMessage: "no process to kill" }),
    );
  });
});
