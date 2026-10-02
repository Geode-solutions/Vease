import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/llm/run.post";
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  runLlamaServer: vi.fn<typeof runLlamaServer>(),
}));

const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

describe("the POST /api/llm/run endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("starts the llama server with the requested model and returns its connection info", async () => {
    vi.mocked(runLlamaServer).mockResolvedValue({
      port: 4891,
      apiKey: "secret",
      model: "custom-model",
    });

    const result = await handler(eventWithBody({ model: "custom-model" }));

    expect(runLlamaServer).toHaveBeenCalledWith({ model: "custom-model" });
    expect(result).toStrictEqual({ statusCode: 200, port: 4891, apiKey: "secret" });
  });

  test("starts the llama server with the default model when none is given", async () => {
    vi.mocked(runLlamaServer).mockResolvedValue({
      port: 4891,
      apiKey: "secret",
      model: "default-model",
    });

    await handler(eventWithBody({}));

    expect(runLlamaServer).toHaveBeenCalledWith({ model: undefined });
  });

  test.each([{ model: "" }, { model: "custom-model", unexpected: true }])(
    "returns a 400 error response for the invalid body %j",
    async (body) => {
      const event = eventWithBody(body);

      await expect(handler(event)).resolves.toMatchObject({
        code: BAD_REQUEST,
        name: "Bad Request",
      });
      expect(getResponseStatus(event)).toBe(BAD_REQUEST);
      expect(runLlamaServer).not.toHaveBeenCalled();
    },
  );

  test("turns a startup failure into a 500 error response", async () => {
    vi.mocked(runLlamaServer).mockRejectedValue(new Error("model download failed"));

    const event = eventWithBody({});
    await expect(handler(event)).resolves.toStrictEqual({
      code: INTERNAL_SERVER_ERROR,
      name: "Internal Server Error",
      description: "model download failed",
    });
    expect(getResponseStatus(event)).toBe(INTERNAL_SERVER_ERROR);
  });
});
