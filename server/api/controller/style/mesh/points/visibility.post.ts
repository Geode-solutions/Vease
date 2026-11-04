// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(
  schemas.api.controller.style.mesh.points.visibility,
  async (params) => {
    const response = await dispatchCommand("style/mesh/points/visibility", params);
    return { statusCode: 200, response };
  },
);
