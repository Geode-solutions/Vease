// Node imports

// Third party imports
import { createError, defineEventHandler, readBody } from "h3";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp.js";

export default defineEventHandler(async (event) => {
  try {
    const { model, NUXT_ROOT_PATH } = await readBody(event);
    const { port, apiKey } = await runLlamaServer({ model, nuxtRootPath: NUXT_ROOT_PATH });

    return {
      statusCode: 200,
      port,
      apiKey,
    };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
