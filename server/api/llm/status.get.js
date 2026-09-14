// Node imports

// Third party imports
import { defineEventHandler } from "h3";

// Local imports
import { getLlamaStatus } from "@vease_server/utils/llama_cpp.js";

export default defineEventHandler(() => ({
  statusCode: 200,
  ...getLlamaStatus(),
}));
