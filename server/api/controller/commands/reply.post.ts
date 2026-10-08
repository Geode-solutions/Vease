// Local imports
import { type ControllerReply, resolveReply } from "@vease_server/utils/command_bus";
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

export default defineTypedEventHandler(schemas.api.controller.commands.reply, (params) => {
  const { requestId, error } = params;
  const result: unknown = params.result;
  // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
  const reply: ControllerReply = params.ok
    ? // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
      { requestId, ok: true, result }
    : // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
      { requestId, ok: false, error: error ?? "Unknown error" };
  resolveReply(reply);
  return { statusCode: 200, response: {} };
});
