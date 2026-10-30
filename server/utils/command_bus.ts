// Third party imports
import { createError } from "h3";

interface ControllerCommand {
  requestId: string;
  command: string;
  params: unknown;
  // Ms the server waits for the reply: relative, as the browser clock may differ from the server's
  timeout: number;
}

type ControllerReply =
  // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
  | { requestId: string; ok: true; result: unknown }
  // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the browser
  | { requestId: string; ok: false; error: string };

interface CommandSink {
  push: (message: string) => void | Promise<void>;
}

interface PendingRequest {
  command: string;
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
  sink: CommandSink;
}

const COMMAND_TIMEOUT_MS = 30_000;
const LONG_COMMAND_TIMEOUT_MS = 120_000;
const SERVICE_UNAVAILABLE = 503;

// Every open Vease tab subscribes; commands go to the most recent one still open
const sinks: CommandSink[] = [];
const pending = new Map<string, PendingRequest>();

function notReadyError(): Error {
  return createError({
    statusCode: SERVICE_UNAVAILABLE,
    statusMessage: "Service Unavailable",
    message: "Vease is not ready (application not open or still launching)",
  });
}

// The browser may still run what it already received, so the caller must not take it as not done
function connectionLostError(command: string): Error {
  return new Error(
    `Lost the connection to Vease while it ran the "${command}" command: it may have been applied, check the current state before trying again`,
  );
}

function rejectPendingOf(sink: CommandSink): void {
  for (const [requestId, request] of pending) {
    if (request.sink === sink) {
      clearTimeout(request.timer);
      request.reject(connectionLostError(request.command));
      pending.delete(requestId);
    }
  }
}

function subscribeCommands(sink: CommandSink): () => void {
  sinks.push(sink);
  return () => {
    const index = sinks.indexOf(sink);
    if (index === -1) {
      return;
    }
    sinks.splice(index, 1);
    rejectPendingOf(sink);
  };
}

// oxlint-disable-next-line promise-function-async -- the promise is settled by the browser reply, not by awaiting
function dispatchCommand<Result = unknown>(
  command: string,
  params: unknown,
  options: { timeout?: number } = {},
): Promise<Result> {
  const sink = sinks.at(-1);
  if (sink === undefined) {
    return Promise.reject(notReadyError());
  }
  const { timeout = COMMAND_TIMEOUT_MS } = options;
  const requestId = crypto.randomUUID();
  const message: ControllerCommand = { requestId, command, params, timeout };

  // oxlint-disable-next-line promise/avoid-new -- the promise is settled later by resolveReply or the timeout
  return new Promise<Result>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error(`Vease did not answer the "${command}" command in time`));
    }, timeout);
    pending.set(requestId, {
      command,
      resolve: (result) => {
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the caller picks the result type the browser replies with
        resolve(result as Result);
      },
      reject,
      timer,
      sink,
    });
    function fail(error: unknown): void {
      clearTimeout(timer);
      pending.delete(requestId);
      reject(error instanceof Error ? error : new Error(String(error)));
    }
    try {
      // oxlint-disable-next-line promise/prefer-await-to-then promise/prefer-await-to-callbacks -- the executor cannot be async
      Promise.resolve(sink.push(JSON.stringify(message))).catch(fail);
    } catch (error) {
      fail(error);
    }
  });
}

function resolveReply(reply: ControllerReply): void {
  const request = pending.get(reply.requestId);
  if (request === undefined) {
    return;
  }
  clearTimeout(request.timer);
  pending.delete(reply.requestId);
  if (reply.ok) {
    request.resolve(reply.result);
  } else {
    request.reject(new Error(reply.error));
  }
}

function resetCommandBus(): void {
  sinks.length = 0;
  for (const request of pending.values()) {
    clearTimeout(request.timer);
  }
  pending.clear();
}

export {
  COMMAND_TIMEOUT_MS,
  LONG_COMMAND_TIMEOUT_MS,
  dispatchCommand,
  resetCommandBus,
  resolveReply,
  subscribeCommands,
};
export type { CommandSink, ControllerCommand, ControllerReply };
