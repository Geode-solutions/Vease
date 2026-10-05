import type { ChildProcess, SpawnOptions } from "node:child_process";
import { type Dirent, chmodSync, existsSync, readdirSync } from "node:fs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getAvailablePort, waitForReady } from "@ogw_server/utils/scripts";
import type {
  getLlamaStatus,
  runLlamaServer,
  stopLlamaServer,
} from "@vease_server/utils/llama_cpp";
import { executableName } from "@ogw_server/utils/path";
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

// The source computes the extracted executable's expected filename via this
// Same helper (it's "llama" on POSIX, "llama.exe" on Windows), so the mocked
// Filesystem entries below need to match it exactly on every platform.
const EXECUTABLE_NAME = executableName("llama");
const TEST_PORT = 4891;
const FAKE_PID = 4242;

function createFakeDirent(name: string, isDirectory: boolean): Dirent {
  return {
    name,
    parentPath: "",
    // `path` is a required field on Dirent (deprecated alias for parentPath); there is
    // No way to construct a valid Dirent without setting it.
    // oxlint-disable-next-line no-deprecated -- required field, deprecated alias for parentPath
    path: "",
    isFile: () => !isDirectory,
    isDirectory: () => isDirectory,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  };
}

// `vi.mocked(readdirSync)` types mockReturnValue against readdirSync's LAST
// Overload (the "buffer" encoding form, returning Dirent<Buffer<ArrayBuffer>>[]),
// Even though every call in this file uses the withFileTypes-only form and
// The mock always returns plain Dirent<string> entries.
function mockReaddirEntries(entries: Dirent[]): void {
  // oxlint-disable-next-line no-unsafe-type-assertion -- vi.mocked(readdirSync) resolves to node:fs's last (buffer) overload, not the withFileTypes-only one actually used
  vi.mocked(readdirSync).mockReturnValue(entries as unknown as Dirent<Buffer<ArrayBuffer>>[]);
}

type Listener = (...args: unknown[]) => void;

// A minimal, hand-rolled .on()/.emit() pair (not Node's EventEmitter) since
// The source calls child.on("spawn"/"exit", ...) and this file only needs to
// Satisfy that exact interface, not implement a general-purpose emitter.
class FakeChildProcess {
  public pid = FAKE_PID;
  public killed = false;
  public kill = vi.fn<() => boolean>((): boolean => {
    this.killed = true;
    return true;
  });

  private readonly listeners = new Map<string, Set<Listener>>();

  // "on" must match Node's ChildProcess.on() exactly; the shared oxlint
  // Config doesn't allow customizing id-length's exceptions list.
  // oxlint-disable-next-line eslint/id-length
  public on(event: string, listener: Listener): this {
    const set = this.listeners.get(event) ?? new Set<Listener>();
    set.add(listener);
    this.listeners.set(event, set);
    return this;
  }

  public emit(event: string, ...args: unknown[]): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }
}

// The extraction cache directory already "contains" the executable, so
// EnsureLlamaExtracted's fs.readdirSync walk finds it immediately and the
// UnzipFile path is never exercised, unless a test overrides these mocks.
function mockExecutableAlreadyExtracted(): void {
  vi.mocked(existsSync).mockReturnValue(true);
  mockReaddirEntries([createFakeDirent(EXECUTABLE_NAME, false)]);
}

interface LlamaCppModule {
  llamaCpp: {
    getLlamaStatus: typeof getLlamaStatus;
    runLlamaServer: typeof runLlamaServer;
    stopLlamaServer: typeof stopLlamaServer;
  };
  spawnedChildren: FakeChildProcess[];
}

async function loadLlamaCppModule(): Promise<LlamaCppModule> {
  vi.resetModules();
  const spawnedChildren: FakeChildProcess[] = [];
  const childProcessModule = await import("node:child_process");
  vi.mocked(childProcessModule.spawn).mockImplementation(() => {
    const child = new FakeChildProcess();
    spawnedChildren.push(child);
    // FakeChildProcess is a minimal hand-rolled test double (see its class comment);
    // It deliberately doesn't implement the full ChildProcess surface.
    // oxlint-disable-next-line no-unsafe-type-assertion -- FakeChildProcess is a deliberately minimal ChildProcess test double
    return child as unknown as ReturnType<typeof childProcessModule.spawn>;
  });

  mockExecutableAlreadyExtracted();
  vi.mocked(getAvailablePort).mockResolvedValue(TEST_PORT);
  vi.mocked(waitForReady).mockImplementation(async (child) => {
    await Promise.resolve();
    return child;
  });

  const llamaCpp = await import("@vease_server/utils/llama_cpp");
  return { llamaCpp, spawnedChildren };
}

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
