// Third party imports
import { defineEventHandler, readBody } from "h3";

// Local imports
import { setGatewayApiKey } from "@vease_server/utils/server_config.js";

export default defineEventHandler(async (event) => {
  const { apiKey } = await readBody(event);
  setGatewayApiKey(apiKey);
  return { statusCode: 200 };
});
