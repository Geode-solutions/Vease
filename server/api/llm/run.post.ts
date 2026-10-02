// Node imports

// Third party imports

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(schemas.api.llm.run, async ({ model }) => {
  const { port, apiKey } = await runLlamaServer({ model });
  return { statusCode: 200, port, apiKey };
});
