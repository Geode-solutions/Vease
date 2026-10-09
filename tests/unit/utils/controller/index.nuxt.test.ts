import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { controllerHandlers, handleCommandMessage } from "@vease/utils/controller/index";
import { createError, readBody } from "h3";
import { consola } from "consola";
import { registerEndpoint } from "@nuxt/test-utils/runtime";

vi.setConfig({ testTimeout: 10_000 });

function commandMessage(requestId: string, command: string): string {
  return JSON.stringify({ requestId, command, params: {} });
}

function noop(): void {
  // Intentionally empty
}

let releaseHeldHandler = noop;

// oxlint-disable-next-line eslint/require-await -- the promise is settled by the test
async function holdUntilReleased(): Promise<unknown> {
  // oxlint-disable-next-line promise/avoid-new -- a manual gate is the only way to hold a handler open
  return new Promise((resolve) => {
    releaseHeldHandler = (): void => {
      resolve("a");
    };
  });
}

describe("controller client", () => {
  let failNextReply = false;
  const replyMock = vi.fn<(body: unknown) => void>();

  registerEndpoint("/api/controller/commands/reply", {
    method: "POST",
    handler: async (event) => {
      if (failNextReply) {
        failNextReply = false;
        throw createError({ statusCode: 500 });
      }
      replyMock(await readBody(event));
      return {};
    },
  });

  beforeEach(() => {
    replyMock.mockReset();
    failNextReply = false;
  });

  afterEach(() => {
    for (const name of Object.keys(controllerHandlers)) {
      Reflect.deleteProperty(controllerHandlers, name);
    }
  });

  test("replies with the handler result", async () => {
    controllerHandlers.fake = vi.fn<() => Promise<unknown>>().mockResolvedValue({ id: "x" });
    handleCommandMessage(commandMessage("r1", "fake"));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r1",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: true,
      result: { id: "x" },
    });
  });

  test("replies with the error message when the handler throws", async () => {
    controllerHandlers.fake = vi.fn<() => Promise<unknown>>().mockRejectedValue(new Error("boom"));
    handleCommandMessage(commandMessage("r1", "fake"));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r1",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: false,
      error: "boom",
    });
  });

  test("replies with an error for an unknown command", async () => {
    handleCommandMessage(commandMessage("r1", "nope"));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r1",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: false,
      error: 'Unknown controller command "nope"',
    });
  });

  test("executes queued commands sequentially", async () => {
    const handlerA = vi.fn<() => Promise<unknown>>().mockImplementation(holdUntilReleased);
    const handlerB = vi.fn<() => Promise<unknown>>().mockResolvedValue("b");
    controllerHandlers.first = handlerA;
    controllerHandlers.second = handlerB;

    handleCommandMessage(commandMessage("r1", "first"));
    handleCommandMessage(commandMessage("r2", "second"));
    await vi.waitFor(() => {
      expect(handlerA).toHaveBeenCalledWith({});
    });
    expect(handlerB).not.toHaveBeenCalled();

    releaseHeldHandler();
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledTimes(2);
    });
    expect(replyMock.mock.calls.map(([reply]) => reply)).toStrictEqual([
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      { requestId: "r1", ok: true, result: "a" },
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      { requestId: "r2", ok: true, result: "b" },
    ]);
  });

  test("replies with an error for a command named like an Object.prototype member", async () => {
    handleCommandMessage(commandMessage("r1", "toString"));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r1",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: false,
      error: 'Unknown controller command "toString"',
    });
  });

  test("keeps running queued commands when a reply POST fails", async () => {
    controllerHandlers.first = vi.fn<() => Promise<unknown>>().mockResolvedValue("a");
    controllerHandlers.second = vi.fn<() => Promise<unknown>>().mockResolvedValue("b");
    const errorSpy = vi.spyOn(consola, "error").mockImplementation(noop);
    failNextReply = true;
    handleCommandMessage(commandMessage("r1", "first"));
    handleCommandMessage(commandMessage("r2", "second"));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r2",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: true,
      result: "b",
    });
    errorSpy.mockRestore();
  });

  test.each(["not json", "null", '{"requestId":1,"command":"x"}'])(
    "ignores a malformed message: %s",
    (rawData) => {
      const errorSpy = vi.spyOn(consola, "error").mockImplementation(noop);
      handleCommandMessage(rawData);
      expect(errorSpy.mock.calls[0]?.[1]).toBe(rawData);
      expect(replyMock).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    },
  );
});
