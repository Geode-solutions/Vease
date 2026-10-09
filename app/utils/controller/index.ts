// Third party imports
import { consola } from "consola";

// Local imports
import type { ControllerCommand, ControllerReply } from "@vease_server/utils/command_bus";
import { commandHandlers } from "@vease/utils/controller/handlers/index";
import { errorMessage } from "@vease/utils/controller/errors";

interface CommandContext {
  deadline: number;
}

type ControllerHandler = (params: unknown, context?: CommandContext) => Promise<unknown>;

const COMMAND_STREAM_URL = "/api/controller/commands/stream";
const COMMAND_REPLY_URL = "/api/controller/commands/reply";
const FIRST_RECONNECT_DELAY_MS = 1000;
const SECOND_RECONNECT_DELAY_MS = 2000;
const MAX_RECONNECT_DELAY_MS = 5000;
const RECONNECT_DELAYS_MS = [
  FIRST_RECONNECT_DELAY_MS,
  SECOND_RECONNECT_DELAY_MS,
  MAX_RECONNECT_DELAY_MS,
];

const controllerHandlers: Record<string, ControllerHandler> = { ...commandHandlers };

const queue: ControllerCommand[] = [];
let draining = false;

async function runCommand({
  requestId,
  command,
  params,
  deadline,
}: ControllerCommand): Promise<ControllerReply> {
  const handler = Object.hasOwn(controllerHandlers, command)
    ? controllerHandlers[command]
    : undefined;
  if (!handler) {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
    return { requestId, ok: false, error: `Unknown controller command "${command}"` };
  }
  // The server already gave up on it: running it now would act behind the caller's back
  if (Date.now() > deadline) {
    return {
      requestId,
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: false,
      error: `The "${command}" command expired before Vease could run it`,
    };
  }
  try {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
    return { requestId, ok: true, result: await handler(params, { deadline }) };
  } catch (error) {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
    return { requestId, ok: false, error: errorMessage(error) };
  }
}

async function processCommand(message: ControllerCommand): Promise<void> {
  const reply = await runCommand(message);
  try {
    await $fetch(COMMAND_REPLY_URL, { method: "POST", body: reply });
  } catch (error) {
    consola.error("[CONTROLLER] failed to post reply", message.requestId, error);
  }
}

async function drainQueue(): Promise<void> {
  if (draining) {
    return;
  }
  draining = true;
  try {
    while (queue.length > 0) {
      const next = queue.shift();
      if (next) {
        // oxlint-disable-next-line eslint/no-await-in-loop -- commands must run strictly one after the other
        await processCommand(next);
      }
    }
  } finally {
    draining = false;
  }
}

function isControllerCommand(value: unknown): value is ControllerCommand {
  return (
    typeof value === "object" &&
    value !== null &&
    "requestId" in value &&
    typeof value.requestId === "string" &&
    "command" in value &&
    typeof value.command === "string" &&
    "deadline" in value &&
    typeof value.deadline === "number"
  );
}

function handleCommandMessage(rawData: string): void {
  let message: unknown = undefined;
  try {
    message = JSON.parse(rawData);
  } catch (error) {
    consola.error("[CONTROLLER] unparsable command", rawData, error);
    return;
  }
  if (!isControllerCommand(message)) {
    consola.error("[CONTROLLER] invalid command", rawData);
    return;
  }
  queue.push(message);
  void drainQueue();
}

// The browser retries a dropped stream by itself, but gives up for good on an error response
function connectControllerClient(failedAttempts = 0): void {
  let attempts = failedAttempts;
  const eventSource = new EventSource(COMMAND_STREAM_URL);
  eventSource.addEventListener("open", () => {
    attempts = 0;
  });
  eventSource.addEventListener("command", (event: MessageEvent<string>) => {
    handleCommandMessage(event.data);
  });
  eventSource.addEventListener("error", () => {
    if (eventSource.readyState !== EventSource.CLOSED) {
      return;
    }
    const delay = RECONNECT_DELAYS_MS[Math.min(attempts, RECONNECT_DELAYS_MS.length - 1)];
    setTimeout(() => {
      connectControllerClient(attempts + 1);
    }, delay);
  });
}

export { connectControllerClient, controllerHandlers, handleCommandMessage };
export type { CommandContext, ControllerHandler };
