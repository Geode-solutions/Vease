import type { ChildProcess, SpawnOptions } from "node:child_process";
import { type Dirent, chmodSync, existsSync } from "node:fs";
import {
  EXECUTABLE_NAME,
  type LlamaCppModule,
  TEST_PORT,
  createFakeDirent,
  loadLlamaCppModule,
  mockReaddirEntries,
} from "@vease_tests/utils/llama_cpp_harness";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { getAvailablePort, waitForReady } from "@ogw_server/utils/scripts";
import os from "node:os";
import path from "node:path";
import { unzipFile } from "@ogw_server/utils/server";

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

describe("server/utils/llama_cpp shutdown and extraction", () => {
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

  test("stopLlamaServer kills the running child and clears the status", async () => {
    const { llamaCpp, spawnedChildren } = current();

    const handle = await llamaCpp.runLlamaServer({ model: "custom-model" });
    llamaCpp.stopLlamaServer();

    expect(spawnedChildren[0]?.kill).toHaveBeenCalledWith();
    expect(llamaCpp.getLlamaStatus()).toStrictEqual({ running: false });
    // Also proves the process handle itself was for this run, not a stray one.
    expect(handle.port).toBe(TEST_PORT);
  });

  test("stopLlamaServer is a no-op when nothing is running", () => {
    expect(() => {
      current().llamaCpp.stopLlamaServer();
    }).not.toThrow();
  });

  test("clears the running server when the child process exits on its own", async () => {
    const { llamaCpp, spawnedChildren } = current();

    await llamaCpp.runLlamaServer({ model: "custom-model" });
    spawnedChildren[0]?.emit("exit", 1);

    expect(llamaCpp.getLlamaStatus()).toStrictEqual({ running: false });
  });

  test.runIf(process.platform !== "win32")(
    "extracts the bundled archive and makes it executable when no cached executable is found yet",
    async () => {
      const { llamaCpp } = current();
      vi.mocked(existsSync).mockReturnValue(false);
      mockReaddirEntries([createFakeDirent(EXECUTABLE_NAME, false)]);

      const handle = await llamaCpp.runLlamaServer({ model: "custom-model" });

      const expectedExecutablePath = path.join(
        os.homedir(),
        ".vease",
        "llama_cpp",
        "ubuntu-x64",
        EXECUTABLE_NAME,
      );
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(unzipFile).toHaveBeenCalledOnce();
      expect(chmodSync).toHaveBeenCalledWith(expectedExecutablePath, "755");
      expect(handle.port).toBe(TEST_PORT);
    },
  );

  // Windows has no chmod bit to set, so the source skips that call there.
  test.runIf(process.platform === "win32")(
    "extracts the bundled archive without chmod when no cached executable is found yet",
    async () => {
      const { llamaCpp } = current();
      vi.mocked(existsSync).mockReturnValue(false);
      mockReaddirEntries([createFakeDirent(EXECUTABLE_NAME, false)]);

      const handle = await llamaCpp.runLlamaServer({ model: "custom-model" });

      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(unzipFile).toHaveBeenCalledOnce();
      expect(chmodSync).not.toHaveBeenCalled();
      expect(handle.port).toBe(TEST_PORT);
    },
  );
});
