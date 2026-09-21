// Third party imports
import { type MCPClient, createMCPClient } from "@ai-sdk/mcp";
import type { LanguageModelV4 } from "@ai-sdk/provider";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.ts";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

const LLAMA_HOST = "127.0.0.1";
let mcpClientPromise: Promise<MCPClient> | undefined = undefined;

function getMcpBaseUrl(): string {
  return `${getAppBaseUrl()}/mcp`;
}

async function getChatModel(): Promise<LanguageModelV4> {
  const { port, apiKey, model } = await runLlamaServer();

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LLAMA_HOST}:${port}/v1`,
    apiKey,
  });
  return provider.chatModel(model);
}

async function getMcpClient(): Promise<MCPClient> {
  mcpClientPromise ??= createMCPClient({
    transport: { type: "http", url: getMcpBaseUrl() },
  });
  const client = await mcpClientPromise;
  return client;
}

async function getChatTools(): Promise<Awaited<ReturnType<MCPClient["tools"]>>> {
  const client = await getMcpClient();
  return client.tools();
}

export { getChatModel, getChatTools };
