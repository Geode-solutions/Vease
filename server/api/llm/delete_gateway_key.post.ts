// Third party imports
import { defineEventHandler } from "h3";

// Local imports
import { deleteGatewayKey } from "@vease_server/utils/ai";

export default defineEventHandler(() => {
  deleteGatewayKey();
  return { statusCode: 200 };
});
