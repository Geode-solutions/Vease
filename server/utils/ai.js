// Third party imports
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp.js";

const LLAMA_HOST = "127.0.0.1";
const CHAT_MODEL_ID = "local";

async function getChatModel({ model } = {}) {
  const { port, apiKey } = await runLlamaServer({ model });

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LLAMA_HOST}:${port}/v1`,
    apiKey,
  });

  return provider.chatModel(CHAT_MODEL_ID);
}

export { getChatModel };
