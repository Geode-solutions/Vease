import { describe, expect, test, vi } from "vitest";
import { eventWithBody } from "@vease_tests/server_utils";
import handler from "@vease_server/api/llm/run.post";
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  runLlamaServer: vi.fn<typeof runLlamaServer>(),
}));

describe("the POST /api/llm/run endpoint", () => {
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

  test("wraps a startup failure into a 500 h3 error", async () => {
    vi.mocked(runLlamaServer).mockRejectedValue(new Error("model download failed"));

    await expect(handler(eventWithBody({}))).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: "model download failed",
    });
  });
});
