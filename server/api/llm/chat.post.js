// Third party imports
import { convertToModelMessages, streamText } from "ai";
import { createError, defineEventHandler, readBody } from "h3";

// Local imports
import { getChatModel } from "@vease_server/utils/ai.js";

export default defineEventHandler(async (event) => {
  try {
    const { messages } = await readBody(event);
    const model = await getChatModel();

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
