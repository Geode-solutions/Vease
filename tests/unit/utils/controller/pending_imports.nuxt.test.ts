import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { trackImport, waitForImport } from "@vease/utils/controller/pending_imports";
import { controllerHandlers } from "@vease/utils/controller/index";

vi.setConfig({ testTimeout: 10_000 });

const TIMEOUT_MS = 1000;

interface Gate {
  promise: Promise<string>;
  open: () => void;
  fail: (error: Error) => void;
}

async function isPending(promise: Promise<unknown>): Promise<boolean> {
  const pending = Symbol("pending");
  const first = await Promise.race([promise, Promise.resolve(pending)]);
  return first === pending;
}

function gate(): Gate {
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  return {
    promise,
    open: (): void => {
      resolve("imported");
    },
    fail: (error): void => {
      reject(error);
    },
  };
}

describe("the pending data imports", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("waits for an import already started", async () => {
    const importing = gate();
    trackImport("a", importing.promise);

    const waiting = waitForImport("a", TIMEOUT_MS);
    await vi.advanceTimersByTimeAsync(0);
    await expect(isPending(waiting)).resolves.toBe(true);

    importing.open();
    await expect(waiting).resolves.toBeUndefined();
  });

  test("waits for an import that starts after the request", async () => {
    const importing = gate();

    const waiting = waitForImport("b", TIMEOUT_MS);
    trackImport("b", importing.promise);
    await vi.advanceTimersByTimeAsync(0);
    await expect(isPending(waiting)).resolves.toBe(true);

    importing.open();
    await expect(waiting).resolves.toBeUndefined();
  });

  test("returns at once for an import already finished", async () => {
    trackImport("c", Promise.resolve("imported"));

    await expect(waitForImport("c", TIMEOUT_MS)).resolves.toBeUndefined();
  });

  test("fails with the import error", async () => {
    const importing = gate();
    trackImport("d", importing.promise);
    const waiting = waitForImport("d", TIMEOUT_MS);

    importing.fail(new Error("unreadable file"));

    await expect(waiting).rejects.toThrow("unreadable file");
  });

  test("gives up once the timeout passed", async () => {
    const waiting = waitForImport("e", TIMEOUT_MS);

    await Promise.all([
      expect(waiting).rejects.toThrow('Data "e" was not imported in time'),
      vi.advanceTimersByTimeAsync(TIMEOUT_MS),
    ]);
  });

  test("the await-data command waits until the command deadline", async () => {
    const importing = gate();
    const deadline = Date.now() + TIMEOUT_MS;

    const waiting = controllerHandlers["await-data"]?.({ id: "f" }, { deadline });
    trackImport("f", importing.promise);
    importing.open();

    await expect(waiting).resolves.toStrictEqual({ id: "f" });
    await Promise.all([
      expect(controllerHandlers["await-data"]?.({ id: "g" }, { deadline })).rejects.toThrow(
        "not imported in time",
      ),
      vi.advanceTimersByTimeAsync(TIMEOUT_MS),
    ]);
  });
});
