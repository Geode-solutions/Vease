// Node imports
import { createError, defineEventHandler, readBody } from "h3";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Third party imports
import { callSchema } from "@ogw_shared/utils/call_schema";
import { getViewerWebSocketClient } from "@geode/opengeodeweb-front/server/utils/server_config.js";
import { parseBoolean } from "@ogw_shared/utils/parse_boolean";

// Local imports

export default defineEventHandler(async (event) => {
  try {
    const { id, visibility } = await readBody(event);
    const schema = opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility;
    const visibilityBool = parseBoolean(visibility);
    const params = { id, visibility: visibilityBool };
    const client = await getViewerWebSocketClient();
    const response = await callSchema({
      schema,
      params,
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
