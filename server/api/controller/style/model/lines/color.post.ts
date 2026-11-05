// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(
  schemas.api.controller.style.model.lines.color,
  async (params) => {
    const response = await dispatchCommand("style/model/lines/color", params);
    return { statusCode: 200, response };
  },
);
