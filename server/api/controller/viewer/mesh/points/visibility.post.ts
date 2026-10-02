// Node imports
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Third party imports
import { callSchema } from "@ogw_shared/utils/call_schema";
import { getViewerWebSocketClient } from "@ogw_server/utils/server_config";
import { parseBoolean } from "@ogw_shared/utils/parse_boolean";

// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(
  schemas.api.controller.viewer.mesh.points.visibility,
  async ({ id, visibility }) => {
    const schema = opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility;
    const params = { id, visibility: parseBoolean(visibility) };
    const client = await getViewerWebSocketClient();
    const response = await callSchema({
      schema,
      params,
      client,
      timeout: undefined,
    });
    return { statusCode: 200, response };
  },
);
