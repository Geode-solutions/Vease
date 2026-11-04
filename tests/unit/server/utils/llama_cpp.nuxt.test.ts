import type { ChildProcess, SpawnOptions } from "node:child_process";
import type { Dirent, chmodSync, existsSync } from "node:fs";
import {
  type LlamaCppModule,
  TEST_PORT,
  loadLlamaCppModule,
} from "@vease_tests/utils/llama_cpp_harness";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { type getAvailablePort, waitForReady } from "@ogw_server/utils/scripts";
import type { unzipFile } from "@ogw_server/utils/server";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("node:child_process"), async (importOriginal) => {
  // The source uses a default import (`import child_process from
  // "node:child_process"`), while this test file needs the named export too;
  // Both must resolve to the exact same mock function.
  const actual = await importOriginal();
  const spawn =
    vi.fn<(command: string, args: readonly string[], options: SpawnOptions) => ChildProcess>();
  const mocked = { ...actual, default: { ...actual, spawn }, spawn };
  // `node:child_process`'s `spawn` has a large overload set; a vi.fn mock can
  // Only implement the single (command, args, options) form this codebase calls.
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock can't reproduce spawn's full native overload set
  return mocked as unknown as typeof actual;
});

type ReaddirWithFileTypes = (dir: string, options: { withFileTypes: true }) => Dirent[];

vi.mock(import("node:fs"), async (importOriginal) => {
  const actual = await importOriginal();
  // The source uses a default import (`import fs from "node:fs"`), while this
  // Test file uses named exports; both must resolve to the same mocks.
  const existsSyncMock = vi.fn<typeof existsSync>();
  const readdirSyncMock = vi.fn<ReaddirWithFileTypes>();
  const chmodSyncMock = vi.fn<typeof chmodSync>();
  const mocked = {
    ...actual,
    existsSync: existsSyncMock,
    readdirSync: readdirSyncMock,
    chmodSync: chmodSyncMock,
    default: {
      ...actual,
      existsSync: existsSyncMock,
      readdirSync: readdirSyncMock,
      chmodSync: chmodSyncMock,
    },
  };
  // `node:fs`'s `readdirSync` has a large overload set; a vi.fn mock can only
  // Implement the single withFileTypes form this codebase calls.
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock can't reproduce readdirSync's full native overload set
  return mocked as unknown as typeof actual;
});

vi.mock(import("@ogw_server/utils/scripts"), () => ({
  getAvailablePort: vi.fn<typeof getAvailablePort>(),
  waitForReady: vi.fn<typeof waitForReady>(),
}));

vi.mock(import("@ogw_server/utils/server"), () => ({
  unzipFile: vi.fn<typeof unzipFile>(),
}));

describe("server/utils/llama_cpp", () => {
  const state: { current: LlamaCppModule | undefined } = { current: undefined };

  beforeEach(async () => {
    state.current = await loadLlamaCppModule();
  });

  function current(): LlamaCppModule {
    if (!state.current) {
      throw new Error("llama_cpp module was not loaded");
    }
    return state.current;
  }

  test("getLlamaStatus reports not running before any server starts", () => {
    expect(current().llamaCpp.getLlamaStatus()).toStrictEqual({ running: false });
  });

  test("runLlamaServer spawns the executable with the requested model", async () => {
    const { llamaCpp, spawnedChildren } = current();

    const handle = await llamaCpp.runLlamaServer({ model: "custom-model" });

    expect(spawnedChildren).toHaveLength(1);
    expect(handle.port).toBe(TEST_PORT);
    expect(handle.model).toBe("custom-model");
  });

  test("runLlamaServer generates a non-empty api key and reports itself as running", async () => {
    const { llamaCpp } = current();

    const handle = await llamaCpp.runLlamaServer({ model: "custom-model" });

    expect(handle.apiKey).toBeTypeOf("string");
    expect(handle.apiKey.length).toBeGreaterThan(0);
    expect(llamaCpp.getLlamaStatus()).toStrictEqual({
      running: true,
      port: TEST_PORT,
      apiKey: handle.apiKey,
    });
  });

  test("reuses the already-running server instead of spawning again", async () => {
    const { llamaCpp, spawnedChildren } = current();

    const first = await llamaCpp.runLlamaServer({ model: "custom-model" });
    const second = await llamaCpp.runLlamaServer({ model: "a-different-model" });

    expect(spawnedChildren).toHaveLength(1);
    expect(second).toStrictEqual(first);
  });

  test("concurrent calls while starting share the same in-flight startup", async () => {
    const { llamaCpp, spawnedChildren } = current();

    const [first, second] = await Promise.all([
      llamaCpp.runLlamaServer({ model: "custom-model" }),
      llamaCpp.runLlamaServer({ model: "custom-model" }),
    ]);

    expect(spawnedChildren).toHaveLength(1);
    expect(second).toStrictEqual(first);
  });

  test("kills the child and clears status when startup fails", async () => {
    const { llamaCpp, spawnedChildren } = current();
    vi.mocked(waitForReady).mockRejectedValueOnce(new Error("never became ready"));

    await expect(llamaCpp.runLlamaServer({ model: "custom-model" })).rejects.toThrow(
      "never became ready",
    );
    expect(spawnedChildren[0]?.kill).toHaveBeenCalledWith();
    expect(llamaCpp.getLlamaStatus()).toStrictEqual({ running: false });
  });

  test("lets a later call retry after a failed startup", async () => {
    const { llamaCpp, spawnedChildren } = current();
    vi.mocked(waitForReady).mockRejectedValueOnce(new Error("never became ready"));
    await expect(llamaCpp.runLlamaServer({ model: "custom-model" })).rejects.toThrow(
      "never became ready",
    );

    const handle = await llamaCpp.runLlamaServer({ model: "custom-model" });

    expect(spawnedChildren).toHaveLength(2);
    expect(handle.port).toBe(TEST_PORT);
  });
});
