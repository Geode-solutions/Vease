// Third party imports
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { createError, defineEventHandler, readBody } from "h3";

// Local imports
import { getChatModel, getChatTools } from "@vease_server/utils/ai";
import { asErrorLike } from "@vease_server/utils/errors";

const MAX_TOOL_STEPS = 5;

export default defineEventHandler(async (event) => {
  try {
    const { messages } = await readBody(event);
    const [model, tools] = await Promise.all([getChatModel(), getChatTools()]);

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(MAX_TOOL_STEPS),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: asErrorLike(error).message,
    });
  }
});
