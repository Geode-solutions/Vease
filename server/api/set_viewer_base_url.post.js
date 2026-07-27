// Third party imports
import { createError, defineEventHandler, readBody } from "h3";

// Local imports
import { setViewerBaseUrl } from "@vease_server/utils/config.js";

export default defineEventHandler(async (event) => {
  try {
    const { baseUrl } = await readBody(event);
    if (!baseUrl) {
      throw createError({ statusCode: 400, statusMessage: "baseUrl is required" });
    }

    await setViewerBaseUrl(baseUrl);
    console.log(`Updated VIEWER_BASE_URL to ${baseUrl}`);

    return { statusCode: 200, baseUrl };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: error.statusCode ?? 500,
      statusMessage: error.statusMessage ?? error.message,
    });
  }
});