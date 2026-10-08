// Third party imports
import { createError } from "h3";

interface ControllerCommand {
  requestId: string;
  command: string;
  params: unknown;
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
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const COMMAND_TIMEOUT_MS = 30_000;
const LONG_COMMAND_TIMEOUT_MS = 120_000;
const SERVICE_UNAVAILABLE = 503;

let currentSink: CommandSink | undefined = undefined;
const pending = new Map<string, PendingRequest>();

function notReadyError(): Error {
  return createError({
    statusCode: SERVICE_UNAVAILABLE,
    statusMessage: "Service Unavailable",
    message: "Vease is not ready (application not open or still launching)",
  });
}

function rejectAllPending(): void {
  for (const [requestId, request] of pending) {
    clearTimeout(request.timer);
    request.reject(notReadyError());
    pending.delete(requestId);
  }
}

function subscribeCommands(sink: CommandSink): () => void {
  currentSink = sink;
  return () => {
    if (currentSink === sink) {
      currentSink = undefined;
      rejectAllPending();
    }
  };
}

// oxlint-disable-next-line promise-function-async -- the promise is settled by the browser reply, not by awaiting
function dispatchCommand<Result = unknown>(
  command: string,
  params: unknown,
  options: { timeout?: number } = {},
): Promise<Result> {
  if (currentSink === undefined) {
    return Promise.reject(notReadyError());
  }
  const sink = currentSink;
  const { timeout = COMMAND_TIMEOUT_MS } = options;
  const requestId = crypto.randomUUID();
  const message: ControllerCommand = { requestId, command, params };

  // oxlint-disable-next-line promise/avoid-new -- the promise is settled later by resolveReply or the timeout
  return new Promise<Result>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error(`Vease did not answer the "${command}" command in time`));
    }, timeout);
    pending.set(requestId, {
      resolve: (result) => {
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the caller picks the result type the browser replies with
        resolve(result as Result);
      },
      reject,
      timer,
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
  currentSink = undefined;
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
