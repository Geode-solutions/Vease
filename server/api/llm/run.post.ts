// Node imports

// Third party imports
import { createError, defineEventHandler, readBody } from "h3";

// Local imports
import { asErrorLike } from "@vease_server/utils/errors";
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

export default defineEventHandler(async (event) => {
  try {
    const { model } = await readBody(event);
    const { port, apiKey } = await runLlamaServer({ model });

    return {
      statusCode: 200,
      port,
      apiKey,
    };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: asErrorLike(error).message,
    });
  }
});
