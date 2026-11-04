// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(schemas.api.controller.view.scene, async (params) => {
  const response = await dispatchCommand("set-scene", params);
  return { statusCode: 200, response };
});
