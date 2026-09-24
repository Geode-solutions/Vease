// Third party imports
import { defineEventHandler } from "h3";

// Local imports
import { deleteGatewayKey } from "@vease_server/utils/llm";

export default defineEventHandler(async () => {
  await deleteGatewayKey();
  return { statusCode: 200 };
});
