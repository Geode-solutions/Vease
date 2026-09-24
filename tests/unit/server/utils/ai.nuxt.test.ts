import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getChatModel, getChatTools } from "@vease_server/utils/ai";
import { runLlamaServer, stopLlamaServer } from "@vease_server/utils/llama_cpp";
import { createMCPClient } from "@ai-sdk/mcp";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  runLlamaServer: vi.fn<typeof runLlamaServer>().mockResolvedValue({
    port: 8080,
    apiKey: "test-ai-gateway-api-key-12345",
    model: "llama-3-8b",
  }),
  stopLlamaServer: vi.fn<typeof stopLlamaServer>().mockReturnValue(undefined),
}));

vi.mock(import("@ai-sdk/openai-compatible"), () => ({
  createOpenAICompatible: vi.fn<typeof createOpenAICompatible>().mockReturnValue({
    chatModel: vi.fn<() => { modelId: string }>().mockReturnValue({ modelId: "llama-3-8b" }),
  } as unknown as ReturnType<typeof createOpenAICompatible>),
}));

vi.mock(import("@ai-sdk/mcp"), () => ({
  createMCPClient: vi.fn<typeof createMCPClient>().mockResolvedValue({
    tools: vi
      .fn<() => Promise<{ search_tools: Record<string, unknown> }>>()
      .mockResolvedValue({ search_tools: {} }),
  } as unknown as Awaited<ReturnType<typeof createMCPClient>>),
}));

vi.mock(import("@geode/opengeodeweb-front/server/utils/server_config"), () => ({
  getAppBaseUrl: vi.fn<typeof getAppBaseUrl>().mockReturnValue("http://localhost:3000"),
}));

describe("the AI server utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("the getChatModel helper", () => {
    test("initializes Llama server and passes API key to provider", async () => {
      const model = await getChatModel();

      expect(runLlamaServer).toHaveBeenCalledOnce();
      expect(createOpenAICompatible).toHaveBeenCalledWith({
        name: "llama-cpp",
        baseURL: "http://127.0.0.1:8080/v1",
        apiKey: "test-ai-gateway-api-key-12345",
      });
      expect(model).toStrictEqual({ modelId: "llama-3-8b" });
    });
  });

  describe("the stop AI gateway API server helper", () => {
    test("stopLlamaServer terminates local AI server process", () => {
      stopLlamaServer();
      expect(stopLlamaServer).toHaveBeenCalledOnce();
    });
  });

  describe("the getChatTools helper", () => {
    test("connects to MCP client and returns tool definitions", async () => {
      const tools = await getChatTools();

      expect(createMCPClient).toHaveBeenCalledWith({
        transport: { type: "http", url: "http://localhost:3000/mcp" },
      });
      expect(tools).toStrictEqual({ search_tools: {} });
    });
  });
});
