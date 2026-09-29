// Third party imports
import { type MCPClient, createMCPClient } from "@ai-sdk/mcp";
import { getAppBaseUrl, getExtensionServerPorts } from "@ogw_server/utils/server_config";
import type { LanguageModelV4 } from "@ai-sdk/provider";
import { createGateway } from "@ai-sdk/gateway";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

const LOOPBACK_HOST = "127.0.0.1";
const DEFAULT_GATEWAY_MODEL = "openai/gpt-4o-mini";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

const mcpClientsByUrl = new Map<string, Promise<MCPClient>>();

function getMcpBaseUrls(): string[] {
  const urls = [`${getAppBaseUrl()}/mcp`];
  for (const port of getExtensionServerPorts().values()) {
    urls.push(`http://${LOOPBACK_HOST}:${port}/mcp`);
  }
  return urls;
}

async function getLlamaChatModel(model: string | undefined): Promise<LanguageModelV4> {
  const { port, apiKey, model: resolvedModel } = await runLlamaServer({ model });

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LOOPBACK_HOST}:${port}/v1`,
    apiKey,
  });
  return provider.chatModel(resolvedModel);
}

function getGatewayChatModel(
  model: string | undefined,
  apiKey: string | undefined,
): LanguageModelV4 {
  if (apiKey === undefined || apiKey === "") {
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
  const chatModel =
    provider === CHAT_PROVIDER.GATEWAY
      ? getGatewayChatModel(model, gatewayApiKey)
      : await getLlamaChatModel(model);
  return chatModel;
}

async function getMcpClient(url: string): Promise<MCPClient> {
  let clientPromise = mcpClientsByUrl.get(url);
  if (!clientPromise) {
    clientPromise = createMCPClient({ transport: { type: "http", url } });
    mcpClientsByUrl.set(url, clientPromise);
  }
  const client = await clientPromise;
  return client;
}

async function getToolsFromUrl(
  url: string,
): Promise<Awaited<ReturnType<MCPClient["tools"]>> | undefined> {
  try {
    const client = await getMcpClient(url);
    return await client.tools();
  } catch (error) {
    console.log(`Failed to load MCP tools from ${url}`, error);
    mcpClientsByUrl.delete(url);
    return undefined;
  }
}

async function getChatTools(): Promise<Awaited<ReturnType<MCPClient["tools"]>>> {
  // Wrapping this in an arrow to appease no-array-callback-reference trips
  // Typescript/promise-function-async + eslint/require-await against each other instead (an arrow
  // Around an already-async call has no `await` of its own) — no phrasing satisfies all three.
  // oxlint-disable-next-line unicorn/no-array-callback-reference
  const toolSets = await Promise.all(getMcpBaseUrls().map(getToolsFromUrl));
  const mergedTools: Awaited<ReturnType<MCPClient["tools"]>> = {};
  for (const toolSet of toolSets) {
    if (toolSet !== undefined) {
      Object.assign(mergedTools, toolSet);
    }
  }
  return mergedTools;
}

export { CHAT_PROVIDER, getChatModel, getChatTools, type ChatProvider };
