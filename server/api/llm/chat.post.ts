// Third party imports
import {
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from "ai";
import { readBody } from "h3";

// Local imports
import { type ChatProvider, getChatModel, getChatTools } from "@vease_server/utils/llm";

import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

const MAX_TOOL_STEPS = 5;

// Streams the answer (AI SDK UI message stream), so the route cannot go through defineTypedEventHandler
export default defineRawEventHandler(schemas.api.llm.chat, async (event) => {
  const {
    messages,
    provider,
    model: modelId,
    gatewayApiKey,
  } = await readBody<{
    messages: Omit<UIMessage, "id">[];
    provider?: ChatProvider;
    model?: string;
    gatewayApiKey?: string;
  }>(event);
  const [model, tools] = await Promise.all([
    getChatModel({ provider, model: modelId, gatewayApiKey }),
    getChatTools(),
  ]);

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(MAX_TOOL_STEPS),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
});
