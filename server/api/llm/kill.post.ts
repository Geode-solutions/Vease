// Node imports

// Third party imports
import { createError, defineEventHandler } from "h3";

// Local imports
import { asErrorLike } from "@vease_server/utils/errors";
import { stopLlamaServer } from "@vease_server/utils/llama_cpp";

export default defineEventHandler(() => {
  try {
    stopLlamaServer();
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: asErrorLike(error).message,
    });
  }
});
