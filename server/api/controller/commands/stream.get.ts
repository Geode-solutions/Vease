// Third party imports
import { createEventStream } from "h3";

// Local imports
import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";
import { subscribeCommands } from "@vease_server/utils/command_bus";

// Server-sent events: the response is not JSON, so the route cannot go through defineTypedEventHandler
export default defineRawEventHandler(schemas.api.controller.commands.stream, async (event) => {
  const stream = createEventStream(event);
  const unsubscribe = subscribeCommands({
    push: async (message) => {
      await stream.push({ event: "command", data: message });
    },
  });
  stream.onClosed(async () => {
    unsubscribe();
    await stream.close();
  });
  await stream.send();
});
