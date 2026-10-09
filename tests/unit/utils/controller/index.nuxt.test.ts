import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  connectControllerClient,
  controllerHandlers,
  handleCommandMessage,
} from "@vease/utils/controller/index";
import { createError, readBody } from "h3";
import { consola } from "consola";
import { registerEndpoint } from "@nuxt/test-utils/runtime";

vi.setConfig({ testTimeout: 10_000 });

const DEADLINE_DELAY_MS = 60_000;
const FIRST_RETRY_MS = 1000;
const SECOND_RETRY_MS = 2000;
const MAX_RETRY_MS = 5000;

function commandMessage(
  requestId: string,
  command: string,
  deadline = Date.now() + DEADLINE_DELAY_MS,
): string {
  return JSON.stringify({ requestId, command, params: {}, deadline });
}

class FakeEventSource extends EventTarget {
  public static readonly CONNECTING = 0;
  public static readonly OPEN = 1;
  public static readonly CLOSED = 2;
  public static readonly instances: FakeEventSource[] = [];
  public readyState: number = FakeEventSource.CONNECTING;
  public readonly url: string;

  public constructor(url: string) {
    super();
    this.url = url;
    FakeEventSource.instances.push(this);
  }

  public fail(readyState: number): void {
    this.readyState = readyState;
    this.dispatchEvent(new Event("error"));
  }
}

function noop(): void {
  // Intentionally empty
}

function latest(): FakeEventSource {
  const instance = FakeEventSource.instances.at(-1);
  if (instance === undefined) {
    throw new Error("no EventSource was opened");
  }
  return instance;
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

  test("replies with the microservice error description of a failed request", async () => {
    controllerHandlers.fake = vi.fn<() => Promise<unknown>>().mockRejectedValue(
      Object.assign(new Error('[POST] "http://back/create/point_set": 400 Bad Request'), {
        data: { code: 400, name: "Bad Request", description: "points must not be empty" },
      }),
    );
    handleCommandMessage(commandMessage("r1", "fake"));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r1",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: false,
      error: "points must not be empty",
    });
  });

  test("skips a command whose deadline passed before it started", async () => {
    const handler = vi.fn<() => Promise<unknown>>().mockResolvedValue("a");
    controllerHandlers.fake = handler;
    handleCommandMessage(commandMessage("r1", "fake", Date.now() - 1));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(handler).not.toHaveBeenCalled();
    expect(replyMock).toHaveBeenCalledWith({
      requestId: "r1",
      // oxlint-disable-next-line eslint/id-length -- `ok` is the reply field shared with the server
      ok: false,
      error: 'The "fake" command expired before Vease could run it',
    });
  });

  test("passes the deadline to the handler", async () => {
    const deadline = Date.now() + DEADLINE_DELAY_MS;
    const handler = vi.fn<(params: unknown, context: unknown) => Promise<unknown>>();
    handler.mockResolvedValue("a");
    controllerHandlers.fake = handler;
    handleCommandMessage(commandMessage("r1", "fake", deadline));
    await vi.waitFor(() => {
      expect(replyMock).toHaveBeenCalledWith(expect.anything());
    });
    expect(handler).toHaveBeenCalledWith({}, { deadline });
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
      expect(handlerA).toHaveBeenCalledWith({}, expect.anything());
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

  describe("the command stream", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      FakeEventSource.instances.length = 0;
      vi.stubGlobal("EventSource", FakeEventSource);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    });

    test("lets the browser retry a stream still connecting", async () => {
      connectControllerClient();
      latest().fail(FakeEventSource.CONNECTING);
      await vi.advanceTimersByTimeAsync(MAX_RETRY_MS);

      expect(FakeEventSource.instances).toHaveLength(1);
    });

    test("reopens a closed stream with a growing delay, capped", async () => {
      connectControllerClient();
      const delays = [FIRST_RETRY_MS, SECOND_RETRY_MS, MAX_RETRY_MS, MAX_RETRY_MS];
      for (const [attempt, delay] of delays.entries()) {
        latest().fail(FakeEventSource.CLOSED);
        // oxlint-disable-next-line eslint/no-await-in-loop -- each retry is scheduled after the previous failure
        await vi.advanceTimersByTimeAsync(delay - 1);
        expect(FakeEventSource.instances).toHaveLength(attempt + 1);
        // oxlint-disable-next-line eslint/no-await-in-loop -- each retry is scheduled after the previous failure
        await vi.advanceTimersByTimeAsync(1);
        expect(FakeEventSource.instances).toHaveLength(attempt + 2);
      }
    });

    test("restarts from the shortest delay once a stream opened", async () => {
      connectControllerClient();
      latest().fail(FakeEventSource.CLOSED);
      await vi.advanceTimersByTimeAsync(FIRST_RETRY_MS);
      latest().fail(FakeEventSource.CLOSED);
      await vi.advanceTimersByTimeAsync(SECOND_RETRY_MS);
      latest().dispatchEvent(new Event("open"));
      latest().fail(FakeEventSource.CLOSED);
      await vi.advanceTimersByTimeAsync(FIRST_RETRY_MS);

      expect(FakeEventSource.instances).toHaveLength(4);
      expect(latest().url).toBe("/api/controller/commands/stream");
    });
  });
});
