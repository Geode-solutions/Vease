// Node imports

// Third party imports
import { createError, defineEventHandler, readBody } from "h3";
import { callSchema } from "@ogw_shared/utils/call_schema";
import { getViewerWebSocketClient } from "@geode/opengeodeweb-front/server/utils/server_config.js";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Local imports

export default defineEventHandler(async (event) => {
  try {
    const { id, visibility } = await readBody(event);
    const client = await getViewerWebSocketClient();
    console.log(`Received request to set points visibility for id: ${id} to ${visibility}`);
    const schema = opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility;
    const params = { id, visibility: Boolean(visibility) };
    console.log({ params });
    const response = await callSchema({
      schema,
      params,
      client,
    });
    console.log({ response });

    return {
      statusCode: 200,
      ...response,
    };

  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
