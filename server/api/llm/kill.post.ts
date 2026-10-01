// Node imports

// Third party imports
import { createError, defineEventHandler } from "h3";
import { consola } from "consola";

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
    consola.info(error);
    throw createError({
      statusCode: 500,
      statusMessage: asErrorLike(error).message,
    });
  }
});
