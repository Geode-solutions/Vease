// Third party imports
import {
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from "ai";
import { createError, defineEventHandler, readBody } from "h3";

// Local imports
import { type ChatProvider, getChatModel, getChatTools } from "@vease_server/utils/llm";
import { asErrorLike } from "@vease_server/utils/errors";

const MAX_TOOL_STEPS = 5;

export default defineEventHandler(async (event) => {
  try {
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
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: asErrorLike(error).message,
    });
  }
});
