// Third party imports
import { createMCPClient } from "@ai-sdk/mcp";
import { createGateway } from "@ai-sdk/gateway";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.js";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp.js";
import { getGatewayApiKey } from "@vease_server/utils/gateway_key_storage.js";

const LLAMA_HOST = "127.0.0.1";
const DEFAULT_GATEWAY_MODEL = "openai/gpt-4o-mini";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" };
let mcpClientPromise = undefined;

function getMcpBaseUrl() {
  return `${getAppBaseUrl()}/mcp`;
}

async function getLlamaChatModel(model) {
  const { port, apiKey, model: resolvedModel } = await runLlamaServer({ model });

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LLAMA_HOST}:${port}/v1`,
    apiKey,
  });
  return provider.chatModel(resolvedModel);
}

function getGatewayChatModel(model) {
  const apiKey = getGatewayApiKey();
  if (!apiKey) {
    throw new Error("No AI Gateway key cached for this session yet");
  }
  const provider = createGateway({ apiKey });
  return provider.languageModel(model ?? DEFAULT_GATEWAY_MODEL);
}

function getChatModel({ provider = CHAT_PROVIDER.LLAMA, model } = {}) {
  if (provider === CHAT_PROVIDER.GATEWAY) {
    return getGatewayChatModel(model);
  }
  return getLlamaChatModel(model);
}

function getMcpClient() {
  if (!mcpClientPromise) {
    mcpClientPromise = createMCPClient({
      transport: { type: "http", url: getMcpBaseUrl() },
    });
  }
  return mcpClientPromise;
}

async function getChatTools() {
  const client = await getMcpClient();
  return client.tools();
}

export { CHAT_PROVIDER, getChatModel, getChatTools };
