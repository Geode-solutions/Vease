// Node imports

// Third party imports
import { createError, defineEventHandler } from "h3";

// Local imports
import { stopLlamaServer } from "@vease_server/utils/llama_cpp.js";

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
      statusMessage: error.message,
    });
  }
});
