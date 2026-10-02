// Node imports

// Third party imports

// Local imports
import { stopLlamaServer } from "@vease_server/utils/llama_cpp";

import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(schemas.api.llm.kill, () => {
  stopLlamaServer();
  return { statusCode: 200 };
});
