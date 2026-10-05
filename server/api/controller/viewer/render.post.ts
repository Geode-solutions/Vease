// Node imports
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

// Third party imports
import { callSchema } from "@ogw_shared/utils/call_schema";
import { getViewerWebSocketClient } from "@ogw_server/utils/server_config";

// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(schemas.api.controller.viewer.render, async () => {
  const schema = opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render;
  const client = await getViewerWebSocketClient();
  const response = await callSchema({
    schema,
    client,
    timeout: undefined,
  });
  return { statusCode: 200, response };
});
