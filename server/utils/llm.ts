// Third party imports
import { type MCPClient, createMCPClient } from "@ai-sdk/mcp";
import type { LanguageModelV4 } from "@ai-sdk/provider";
import { createGateway } from "@ai-sdk/gateway";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getAppBaseUrl } from "@ogw_server/utils/server_config";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

const LLAMA_HOST = "127.0.0.1";
const DEFAULT_GATEWAY_MODEL = "openai/gpt-4o-mini";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

let mcpClientPromise: Promise<MCPClient> | undefined = undefined;

function getMcpBaseUrl(): string {
  return `${getAppBaseUrl()}/mcp`;
}

async function getLlamaChatModel(model: string | undefined): Promise<LanguageModelV4> {
  const { port, apiKey, model: resolvedModel } = await runLlamaServer({ model });

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LLAMA_HOST}:${port}/v1`,
    apiKey,
  });
  return provider.chatModel(resolvedModel);
}

function getGatewayChatModel(
  model: string | undefined,
  apiKey: string | undefined,
): LanguageModelV4 {
  if (!apiKey) {
    throw new Error("Missing AI Gateway key for this request");
  }
  const provider = createGateway({ apiKey });
  return provider.languageModel(model ?? DEFAULT_GATEWAY_MODEL);
}

async function getChatModel({
  provider = CHAT_PROVIDER.LLAMA,
  model,
  gatewayApiKey,
}: {
  provider?: ChatProvider;
  model?: string;
  gatewayApiKey?: string;
} = {}): Promise<LanguageModelV4> {
  if (provider === CHAT_PROVIDER.GATEWAY) {
    return getGatewayChatModel(model, gatewayApiKey);
  }
  return await getLlamaChatModel(model);
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

export { CHAT_PROVIDER, getChatModel, getChatTools, type ChatProvider };
