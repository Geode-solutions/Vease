// Third party imports
import { consola } from "consola";

// Local imports
import type { ControllerCommand, ControllerReply } from "@vease_server/utils/command_bus";

type ControllerHandler = (params: unknown) => Promise<unknown>;

const COMMAND_STREAM_URL = "/api/controller/commands/stream";
const COMMAND_REPLY_URL = "/api/controller/commands/reply";

const controllerHandlers: Record<string, ControllerHandler> = {};

const queue: ControllerCommand[] = [];
let draining = false;

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function runCommand({
  requestId,
  command,
  params,
}: ControllerCommand): Promise<ControllerReply> {
  const handler = Object.hasOwn(controllerHandlers, command)
    ? controllerHandlers[command]
    : undefined;
  if (!handler) {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
    return { requestId, ok: false, error: `Unknown controller command "${command}"` };
  }
  try {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
    return { requestId, ok: true, result: await handler(params) };
  } catch (error) {
    // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
    return { requestId, ok: false, error: toErrorMessage(error) };
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
    typeof value.command === "string"
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

function connectControllerClient(): EventSource {
  const eventSource = new EventSource(COMMAND_STREAM_URL);
  eventSource.addEventListener("command", (event: MessageEvent<string>) => {
    handleCommandMessage(event.data);
  });
  return eventSource;
}

export { connectControllerClient, controllerHandlers, handleCommandMessage };
export type { ControllerHandler };
