import { CHAT_PROVIDER, getChatModel, getChatTools } from "@vease_server/utils/llm";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createGateway } from "@ai-sdk/gateway";
import { createMCPClient } from "@ai-sdk/mcp";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { getAppBaseUrl } from "@ogw_server/utils/server_config";
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  runLlamaServer: vi.fn<typeof runLlamaServer>().mockResolvedValue({
    port: 8080,
    apiKey: "test-llama-api-key-12345",
    model: "llama-3-8b",
  }),
}));

vi.mock(import("@ai-sdk/openai-compatible"), () => ({
  createOpenAICompatible: vi.fn<typeof createOpenAICompatible>().mockReturnValue({
    chatModel: vi
      .fn<(modelId: string) => { modelId: string }>()
      .mockImplementation((modelId) => ({ modelId })),
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `chatModel` member this codebase uses, not the full SDK provider shape
  } as unknown as ReturnType<typeof createOpenAICompatible>),
}));

vi.mock(import("@ai-sdk/gateway"), () => ({
  createGateway: vi.fn<typeof createGateway>().mockReturnValue({
    languageModel: vi
      .fn<(modelId: string) => { modelId: string }>()
      .mockImplementation((modelId) => ({ modelId })),
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `languageModel` member this codebase uses, not the full SDK provider shape
  } as unknown as ReturnType<typeof createGateway>),
}));

vi.mock(import("@ai-sdk/mcp"), () => ({
  createMCPClient: vi.fn<typeof createMCPClient>().mockResolvedValue({
    tools: vi
      .fn<() => Promise<{ search_tools: Record<string, unknown> }>>()
      .mockResolvedValue({ search_tools: {} }),
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `tools` member this codebase uses, not the full SDK client shape
  } as unknown as Awaited<ReturnType<typeof createMCPClient>>),
}));

vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getAppBaseUrl: vi.fn<typeof getAppBaseUrl>().mockReturnValue("http://localhost:3000"),
}));

describe("the LLM server utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("the getChatModel helper", () => {
    test("defaults to the local llama provider and passes its API key to the provider", async () => {
      const model = await getChatModel();

      expect(runLlamaServer).toHaveBeenCalledWith({ model: undefined });
      expect(createOpenAICompatible).toHaveBeenCalledWith({
        name: "llama-cpp",
        baseURL: "http://127.0.0.1:8080/v1",
        apiKey: "test-llama-api-key-12345",
      });
      expect(createGateway).not.toHaveBeenCalled();
      expect(model).toStrictEqual({ modelId: "llama-3-8b" });
    });

    test("forwards the requested model to the llama server", async () => {
      await getChatModel({ provider: CHAT_PROVIDER.LLAMA, model: "custom-model" });

      expect(runLlamaServer).toHaveBeenCalledWith({ model: "custom-model" });
    });

    test("uses the AI gateway with the default model when the gateway provider is selected", async () => {
      const model = await getChatModel({
        provider: CHAT_PROVIDER.GATEWAY,
        gatewayApiKey: "gateway-key",
      });

      expect(createGateway).toHaveBeenCalledWith({ apiKey: "gateway-key" });
      expect(runLlamaServer).not.toHaveBeenCalled();
      expect(model).toStrictEqual({ modelId: "openai/gpt-4o-mini" });
    });

    test("uses the requested gateway model when one is given", async () => {
      const model = await getChatModel({
        provider: CHAT_PROVIDER.GATEWAY,
        model: "anthropic/claude",
        gatewayApiKey: "gateway-key",
      });

      expect(model).toStrictEqual({ modelId: "anthropic/claude" });
    });

    test.each([undefined, ""])(
      "rejects the gateway provider when the API key is %j",
      async (gatewayApiKey) => {
        await expect(
          getChatModel({ provider: CHAT_PROVIDER.GATEWAY, gatewayApiKey }),
        ).rejects.toThrow("Missing AI Gateway key for this request");
        expect(createGateway).not.toHaveBeenCalled();
      },
    );
  });

  describe("the getChatTools helper", () => {
    test("connects once to the MCP server and returns its tool definitions", async () => {
      const tools = await getChatTools();
      await getChatTools();

      expect(createMCPClient).toHaveBeenCalledExactlyOnceWith({
        transport: { type: "http", url: "http://localhost:3000/mcp" },
      });
      expect(tools).toStrictEqual({ search_tools: {} });
    });
  });
});
