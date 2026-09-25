// Third party imports
import { type H3Event, createError, defineEventHandler, readBody } from "h3";

// Local imports
import { runVeaseModeling } from "@vease_server/utils/modeling_launcher";

interface RunModelingBody {
  NUXT_ROOT_PATH: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { NUXT_ROOT_PATH } = await readBody<RunModelingBody>(event);
    const port = await runVeaseModeling(NUXT_ROOT_PATH);
    return { statusCode: 200, port };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : String(error),
    });
  }
});
