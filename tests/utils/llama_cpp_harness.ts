import { type Dirent, existsSync, readdirSync } from "node:fs";
import { getAvailablePort, waitForReady } from "@ogw_server/utils/scripts";
import type {
  getLlamaStatus,
  runLlamaServer,
  stopLlamaServer,
} from "@vease_server/utils/llama_cpp";
import { executableName } from "@ogw_server/utils/path";
import { vi } from "vitest";

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

export {
  EXECUTABLE_NAME,
  type LlamaCppModule,
  TEST_PORT,
  createFakeDirent,
  loadLlamaCppModule,
  mockReaddirEntries,
};
