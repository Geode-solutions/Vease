import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getChatModel, getChatTools } from "@vease_server/utils/ai";
import * as llamaCppModule from "@vease_server/utils/llama_cpp";
import * as openAICompatibleModule from "@ai-sdk/openai-compatible";
import * as mcpModule from "@ai-sdk/mcp";

vi.mock("@vease_server/utils/llama_cpp", () => ({
  runLlamaServer: vi.fn().mockResolvedValue({
    port: 8080,
    apiKey: "test-ai-gateway-api-key-12345",
    model: "llama-3-8b",
  }),
  stopLlamaServer: vi.fn().mockReturnValue(undefined),
}));

vi.mock("@ai-sdk/openai-compatible", () => ({
  createOpenAICompatible: vi.fn().mockReturnValue({
    chatModel: vi.fn().mockReturnValue({ modelId: "llama-3-8b" }),
  }),
}));

vi.mock("@ai-sdk/mcp", () => ({
  createMCPClient: vi.fn().mockResolvedValue({
    tools: vi.fn().mockResolvedValue({ search_tools: {} }),
  }),
}));

vi.mock("@geode/opengeodeweb-front/server/utils/server_config.ts", () => ({
  getAppBaseUrl: vi.fn().mockReturnValue("http://localhost:3000"),
}));

describe("AI Server Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getChatModel", () => {
    test("initializes Llama server and passes API key to provider", async () => {
      const model = await getChatModel();

      expect(llamaCppModule.runLlamaServer).toHaveBeenCalled();
      expect(openAICompatibleModule.createOpenAICompatible).toHaveBeenCalledWith({
        name: "llama-cpp",
        baseURL: "http://127.0.0.1:8080/v1",
        apiKey: "test-ai-gateway-api-key-12345",
      });
      expect(model).toEqual({ modelId: "llama-3-8b" });
    });
  });

  describe("delete/stop AI gateway API server", () => {
    test("stopLlamaServer terminates local AI server process", () => {
      llamaCppModule.stopLlamaServer();
      expect(llamaCppModule.stopLlamaServer).toHaveBeenCalled();
    });
  });

  describe("getChatTools", () => {
    test("connects to MCP client and returns tool definitions", async () => {
      const tools = await getChatTools();

      expect(mcpModule.createMCPClient).toHaveBeenCalledWith({
        transport: { type: "http", url: "http://localhost:3000/mcp" },
      });
      expect(tools).toEqual({ search_tools: {} });
    });
  });
});
