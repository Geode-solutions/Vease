// Third party imports
import { defineEventHandler } from "h3";

// Local imports
import { clearGatewayApiKey } from "@vease_server/utils/server_config.js";

export default defineEventHandler(() => {
  clearGatewayApiKey();
  return { statusCode: 200 };
});
