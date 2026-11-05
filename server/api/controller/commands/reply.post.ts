// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import { resolveReply } from "@vease_server/utils/command_bus";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(schemas.api.controller.commands.reply, (params) => {
  const { requestId, error } = params;
  const result: unknown = params.result;
  if (params.ok) {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
    resolveReply({ requestId, ok: true, result });
  } else {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
    resolveReply({ requestId, ok: false, error: error ?? "Unknown error" });
  }
  return { statusCode: 200, response: {} };
});
