// Third party imports
import {
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from "ai";
import { readBody } from "h3";

// Local imports
import {
  type ChatProvider,
  getChatModel,
  getChatTools,
  readDataContext,
} from "@vease_server/utils/llm";

import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";

const MAX_TOOL_STEPS = 5;

const SYSTEM_PROMPT = `You are the assistant of Vease, a geoscience application. You act on the user's
project only through the provided tools. Follow these rules.

Object IDs
- An object ID is the 32-character hexadecimal "id" of an object. IDs come from the "Loaded data"
  section below or from \`read-resource\`. Never pass an object name as an ID and never guess an ID.
- Use \`read-resource\` with \`vease://data/{id}\` to learn an object's targets, components and
  attributes before styling it.
- If the user names an object that is not loaded, say that it must first be loaded or created.

Tools
- When a tool needs an object that does not exist yet, create it first with the appropriate tool,
  or ask the user for what is missing.
- Respect the constraints written in each tool description.
- When the user asks for several actions (for example several files to load), call the tool once
  per item.

Answers
- If a tool fails, report its error message and the step that failed. Do not retry with invented
  values.
- Keep answers short: say what was done, naming objects by their name. Do not show IDs, file paths
  or technical details unless asked.`;

// Streams the answer (AI SDK UI message stream), so the route cannot go through defineTypedEventHandler
export default defineRawEventHandler(schemas.api.llm.chat, async (event) => {
  const {
    messages,
    provider,
    model: modelId,
    gatewayApiKey,
  } = await readBody<{
    messages: Omit<UIMessage, "id">[];
    provider?: ChatProvider;
    model?: string;
    gatewayApiKey?: string;
  }>(event);
  const [model, tools, dataContext] = await Promise.all([
    getChatModel({ provider, model: modelId, gatewayApiKey }),
    getChatTools(),
    readDataContext(),
  ]);

  const result = streamText({
    model,
    instructions:
      dataContext === undefined
        ? SYSTEM_PROMPT
        : `${SYSTEM_PROMPT}\n\nLoaded data (vease://data):\n${dataContext}`,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(MAX_TOOL_STEPS),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
});
