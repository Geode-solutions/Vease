// `ok` is the reply field shared with the browser; it appears in most assertions
// oxlint-disable eslint/id-length
import {
  COMMAND_TIMEOUT_MS,
  type ControllerCommand,
  LONG_COMMAND_TIMEOUT_MS,
  dispatchCommand,
  resetCommandBus,
  resolveReply,
  subscribeCommands,
} from "@vease_server/utils/command_bus";
import { type Mock, afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.setConfig({ testTimeout: 10_000 });

const SERVICE_UNAVAILABLE = 503;

type PushMock = Mock<(message: string) => void>;

function createSink(): PushMock {
  return vi.fn<(message: string) => void>();
}

function pushedCommand(push: PushMock): ControllerCommand {
  const [message] = push.mock.calls[0] ?? [];
  const command: unknown = JSON.parse(message ?? "{}");
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the bus pushes the JSON of a ControllerCommand
  return command as ControllerCommand;
}

function pushedRequestId(push: PushMock): string {
  return pushedCommand(push).requestId;
}

describe("command bus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetCommandBus();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("pushes the command to the subscriber and resolves with its reply", async () => {
    const push = createSink();
    subscribeCommands({ push });

    const promise = dispatchCommand("set-style", { a: 1 });
    const { requestId, ...command } = pushedCommand(push);
    expect(requestId).toStrictEqual(expect.any(String));
    expect(command).toStrictEqual({ command: "set-style", params: { a: 1 } });

    resolveReply({ requestId, ok: true, result: { done: true } });
    await expect(promise).resolves.toStrictEqual({ done: true });
  });

  test("rejects with the browser error message", async () => {
    const push = createSink();
    subscribeCommands({ push });

    const promise = dispatchCommand("set-style", {});
    resolveReply({ requestId: pushedRequestId(push), ok: false, error: "attribute not found" });
    await expect(promise).rejects.toThrow("attribute not found");
  });

  test("throws a 503 when no browser is subscribed", async () => {
    const promise = dispatchCommand("set-style", {});
    await expect(promise).rejects.toMatchObject({ statusCode: SERVICE_UNAVAILABLE });
    await expect(promise).rejects.toThrow("Vease is not ready");
  });

  test("times out", async () => {
    subscribeCommands({ push: createSink() });

    const promise = dispatchCommand("set-style", {});
    await Promise.all([
      expect(promise).rejects.toThrow("in time"),
      vi.advanceTimersByTimeAsync(COMMAND_TIMEOUT_MS),
    ]);
  });

  test("honors a custom timeout", async () => {
    subscribeCommands({ push: createSink() });

    const promise = dispatchCommand("export", {}, { timeout: LONG_COMMAND_TIMEOUT_MS });
    await Promise.all([
      expect(promise).rejects.toThrow("in time"),
      (async (): Promise<void> => {
        await vi.advanceTimersByTimeAsync(COMMAND_TIMEOUT_MS);
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(LONG_COMMAND_TIMEOUT_MS - COMMAND_TIMEOUT_MS);
      })(),
    ]);
  });

  test("rejects pending requests when the subscriber disconnects", async () => {
    const unsubscribe = subscribeCommands({ push: createSink() });

    const promise = dispatchCommand("set-style", {});
    unsubscribe();
    await expect(promise).rejects.toThrow("Vease is not ready");
  });

  test("rejects when the subscriber fails to push the command", async () => {
    const failure = new Error("stream closed");
    subscribeCommands({
      push: () => {
        throw failure;
      },
    });
    await expect(dispatchCommand("set-style", {})).rejects.toBe(failure);
    expect(vi.getTimerCount()).toBe(0);

    subscribeCommands({
      push: vi.fn<(message: string) => Promise<void>>().mockRejectedValue(failure),
    });
    await expect(dispatchCommand("set-style", {})).rejects.toBe(failure);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("routes new commands to the latest subscriber", async () => {
    const pushA = createSink();
    const pushB = createSink();
    const unsubscribeA = subscribeCommands({ push: pushA });
    subscribeCommands({ push: pushB });

    const promise = dispatchCommand("set-style", {});
    expect(pushA).not.toHaveBeenCalled();
    expect(pushedCommand(pushB).command).toBe("set-style");

    unsubscribeA();
    resolveReply({ requestId: pushedRequestId(pushB), ok: true, result: 1 });
    await expect(promise).resolves.toBe(1);
  });

  test("ignores late and unknown replies", async () => {
    const push = createSink();
    subscribeCommands({ push });

    expect(() => {
      resolveReply({ requestId: "unknown", ok: true, result: undefined });
    }).not.toThrow();

    const promise = dispatchCommand("set-style", {});
    await Promise.all([
      expect(promise).rejects.toThrow("in time"),
      vi.advanceTimersByTimeAsync(COMMAND_TIMEOUT_MS),
    ]);

    expect(() => {
      resolveReply({ requestId: pushedRequestId(push), ok: true, result: undefined });
    }).not.toThrow();
  });
});
