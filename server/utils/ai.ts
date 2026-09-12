// Third party imports
import { createMCPClient } from "@ai-sdk/mcp";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { MCPClient } from "@ai-sdk/mcp";
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.js";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

const LLAMA_HOST = "127.0.0.1";
let mcpClientPromise: Promise<MCPClient> | undefined = undefined;

function getMcpBaseUrl() {
  return `${getAppBaseUrl()}/mcp`;
}

async function getChatModel() {
  const { port, apiKey, model } = await runLlamaServer();

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LLAMA_HOST}:${port}/v1`,
    apiKey,
  });
  return provider.chatModel(model);
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

export { getChatModel, getChatTools };
