// Node imports
import { createError, defineEventHandler } from "h3";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Third party imports
import { callSchema } from "@ogw_shared/utils/call_schema";
import { getViewerWebSocketClient } from "@geode/opengeodeweb-front/server/utils/server_config.js";

// Local imports

export default defineEventHandler(async () => {
  try {
    const schema = opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render;
    const client = await getViewerWebSocketClient();
    const response = await callSchema({
      schema,
      client,
    });
    return {
      statusCode: 200,
      response,
    };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
