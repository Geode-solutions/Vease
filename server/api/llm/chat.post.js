// Third party imports
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { createError, defineEventHandler, getHeader, readBody } from "h3";

// Local imports
import { getChatModel, getChatTools } from "@vease_server/utils/ai.js";
import { authorizeAiRequest } from "@vease_server/utils/vease_api.js";

const MAX_TOOL_STEPS = 5;
const UNAUTHORIZED_STATUS = 401;
const INTERNAL_SERVER_ERROR_STATUS = 500;

export default defineEventHandler(async (event) => {
  try {
    const { messages, provider, model: modelId } = await readBody(event);

    const authorization = getHeader(event, "authorization");
    if (!authorization) {
      throw createError({
        statusCode: UNAUTHORIZED_STATUS,
        statusMessage: "Missing Authorization header",
      });
    }
    const { authorized, status, body } = await authorizeAiRequest({ authorization, provider });
    if (!authorized) {
      throw createError({ statusCode: status, statusMessage: body?.error ?? "Unauthorized" });
    }

    const [model, tools] = await Promise.all([
      getChatModel({ provider, model: modelId }),
      getChatTools(),
    ]);
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
      statusCode: error.statusCode ?? INTERNAL_SERVER_ERROR_STATUS,
      statusMessage: error.statusMessage ?? error.message,
    });
  }
});
