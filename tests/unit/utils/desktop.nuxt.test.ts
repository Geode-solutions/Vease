import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { deleteCredentials, getCredentials, parseArgs, saveCredentials } from "~~/utils/desktop";

const { FAKE_PORT } = vi.hoisted(() => ({ FAKE_PORT: 4000 }));

// This file is Electron main-process code, not part of the Nuxt app
// Boundary. Outside a real Electron process, `require("electron")` resolves
// To a path string rather than the API object, and the module also reads
// App.getPath(...) at import time, so "electron" must be fully mocked before
// The module under test is ever imported.
const electronMocks = vi.hoisted(() => ({
  getPath: vi.fn<() => string>().mockReturnValue("/fake/userData"),
  setPath: vi.fn<(name: string, path: string) => void>(),
  isPackaged: false,
  isEncryptionAvailable: vi.fn<() => boolean>().mockReturnValue(true),
  encryptString: vi.fn<(value: string) => Buffer>((value) => Buffer.from(`encrypted:${value}`)),
  decryptString: vi.fn<(buffer: Buffer) => string>((buffer) =>
    buffer.toString("utf8").replace(/^encrypted:/u, ""),
  ),
}));

const fsMocks = vi.hoisted(() => ({
  existsSync: vi.fn<(path: string) => boolean>(),
  writeFileSync: vi.fn<(path: string, data: Buffer) => void>(),
  readFileSync: vi.fn<(path: string) => Buffer>(),
  unlinkSync: vi.fn<(path: string) => void>(),
}));

vi.mock(import("electron"), () => ({
  app: {
    getPath: electronMocks.getPath,
    setPath: electronMocks.setPath,
    get isPackaged() {
      return electronMocks.isPackaged;
    },
  },
  safeStorage: {
    isEncryptionAvailable: electronMocks.isEncryptionAvailable,
    encryptString: electronMocks.encryptString,
    decryptString: electronMocks.decryptString,
  },
  shell: { openExternal: vi.fn<(url: string) => Promise<void>>() },
  BrowserWindow: vi.fn<new () => unknown>(),
  utilityProcess: { fork: vi.fn<(path: string) => unknown>() },
}));

vi.mock(import("node:fs"), () => ({
  default: fsMocks,
  ...fsMocks,
}));

vi.mock(import("@geode/opengeodeweb-front/server/utils/scripts.js"), () => ({
  getAvailablePort: vi.fn<() => Promise<number>>().mockResolvedValue(FAKE_PORT),
}));

vi.mock(import("@geode/opengeodeweb-front/shared/scripts.js"), () => ({
  setAppBaseUrl: vi.fn<(baseUrl: string) => Promise<void>>().mockResolvedValue(undefined),
}));

describe("desktop (electron main process) utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveCredentials()", () => {
    test("encrypts and writes credentials when encryption is available", () => {
      electronMocks.isEncryptionAvailable.mockReturnValue(true);

      const result = saveCredentials("user@example.com", "hunter2");

      expect(result).toStrictEqual({ success: true });
      expect(fsMocks.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("credentials.dat"),
        expect.anything(),
      );
      expect(electronMocks.encryptString).toHaveBeenCalledWith(
        JSON.stringify({ email: "user@example.com", password: "hunter2" }),
      );
    });

    test("fails without writing when encryption is unavailable", () => {
      electronMocks.isEncryptionAvailable.mockReturnValue(false);

      const result = saveCredentials("user@example.com", "hunter2");

      expect(result).toStrictEqual({ success: false, error: "Encryption not available" });
      expect(fsMocks.writeFileSync).not.toHaveBeenCalled();
    });

    test("returns an error result if writing to disk throws", () => {
      electronMocks.isEncryptionAvailable.mockReturnValue(true);
      fsMocks.writeFileSync.mockImplementation(() => {
        throw new Error("disk full");
      });

      const result = saveCredentials("user@example.com", "hunter2");

      expect(result).toStrictEqual({ success: false, error: "disk full" });
    });
  });

  describe("getCredentials()", () => {
    test("returns success with no credentials when the file does not exist", () => {
      fsMocks.existsSync.mockReturnValue(false);

      const result = getCredentials();

      expect(result).toStrictEqual({ success: true, credentials: undefined });
      expect(fsMocks.readFileSync).not.toHaveBeenCalled();
    });

    test("decrypts and returns stored credentials", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readFileSync.mockReturnValue(
        Buffer.from(`encrypted:${JSON.stringify({ email: "a@b.com", password: "pw" })}`),
      );

      const result = getCredentials();

      expect(result).toStrictEqual({
        success: true,
        credentials: { email: "a@b.com", password: "pw" },
      });
    });

    test("reports corrupted credentials when the decrypted payload has the wrong shape", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readFileSync.mockReturnValue(Buffer.from(`encrypted:${JSON.stringify({ foo: 1 })}`));

      const result = getCredentials();

      expect(result).toStrictEqual({ success: false, error: "Stored credentials are corrupted" });
    });

    test("returns an error result if reading from disk throws", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readFileSync.mockImplementation(() => {
        throw new Error("permission denied");
      });

      const result = getCredentials();

      expect(result).toStrictEqual({ success: false, error: "permission denied" });
    });
  });

  describe("deleteCredentials()", () => {
    test("removes the credentials file when it exists", () => {
      fsMocks.existsSync.mockReturnValue(true);

      const result = deleteCredentials();

      expect(result).toStrictEqual({ success: true });
      expect(fsMocks.unlinkSync).toHaveBeenCalledWith(expect.stringContaining("credentials.dat"));
    });

    test("is a no-op success when there is nothing to delete", () => {
      fsMocks.existsSync.mockReturnValue(false);

      const result = deleteCredentials();

      expect(result).toStrictEqual({ success: true });
      expect(fsMocks.unlinkSync).not.toHaveBeenCalled();
    });

    test("returns an error result if deleting throws", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.unlinkSync.mockImplementation(() => {
        throw new Error("busy");
      });

      const result = deleteCredentials();

      expect(result).toStrictEqual({ success: false, error: "busy" });
    });
  });

  describe("parseArgs()", () => {
    test("splits flags, files and raw args from process.argv in dev mode", () => {
      electronMocks.isPackaged = false;
      const originalArgv = process.argv;
      process.argv = ["node", "electron/index.js", "--foo", "model.msh", "-x"];

      const result = parseArgs();

      expect(result).toStrictEqual({
        flags: ["--foo"],
        files: ["model.msh"],
        raw: ["--foo", "model.msh", "-x"],
      });

      process.argv = originalArgv;
    });

    test("drops one fewer leading argument when packaged", () => {
      electronMocks.isPackaged = true;
      const originalArgv = process.argv;
      process.argv = ["Vease.exe", "model.msh"];

      const result = parseArgs();

      expect(result).toStrictEqual({ flags: [], files: ["model.msh"], raw: ["model.msh"] });

      process.argv = originalArgv;
    });
  });
});
