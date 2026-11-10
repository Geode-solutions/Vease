// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Local imports
import {
  DESKTOP_ENTRY_MARKER,
  desktopEntryContent,
  registerLinuxDesktopEntry,
  windowIconPath,
} from "~~/utils/desktop_icon";

vi.setConfig({ testTimeout: 10_000 });

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..", "..", "..");
const APPIMAGE = "/home/me/Apps/Vease_linux.AppImage";

// Electron can't be imported outside an Electron process: only the members used are mocked
const electronMocks = vi.hoisted(() => ({ isPackaged: false, appPath: "" }));
vi.mock(import("electron"), () => {
  const mocked = {
    app: {
      get isPackaged(): boolean {
        return electronMocks.isPackaged;
      },
      getAppPath: (): string => electronMocks.appPath,
    },
  };
  // oxlint-disable-next-line no-unsafe-type-assertion -- electron mock can't reproduce the full CrossProcessExports shape
  return mocked as unknown as typeof Electron.CrossProcessExports;
});

// Keeps update-desktop-database from writing into the temp folder while it is removed
const { spawnMock } = vi.hoisted(() => ({ spawnMock: vi.fn<() => unknown>() }));
vi.mock(import("node:child_process"), async (importOriginal) => {
  const actual = await importOriginal();
  const mocked = {
    ...actual,
    spawn: spawnMock,
    default: { ...actual, spawn: spawnMock },
  };
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock only replaces spawn, not its overload set
  return mocked as unknown as typeof actual;
});

const originalPlatform = process.platform;
const originalResourcesPath = process.resourcesPath;
const originalExecPath = process.execPath;
const originalEnv = { ...process.env };

function setProcessValue(key: "execPath" | "platform" | "resourcesPath", value: string): void {
  Object.defineProperty(process, key, { value, configurable: true });
}

describe("desktop icon (electron main process) utils", () => {
  let tmpDir = "";
  let dataHome = "";
  let resourcesPath = "";

  function desktopFile(): string {
    return path.join(dataHome, "applications", "vease.desktop");
  }
  function iconFile(): string {
    return path.join(dataHome, "icons", "hicolor", "256x256", "apps", "vease.png");
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vease-icon-"));
    dataHome = path.join(tmpDir, "data");
    resourcesPath = path.join(tmpDir, "resources");
    const publicDir = path.join(resourcesPath, "web", "public");
    fs.mkdirSync(publicDir, { recursive: true });
    for (const icon of ["256x256.png", "favicon.ico"]) {
      fs.copyFileSync(path.join(PROJECT_ROOT, "public", icon), path.join(publicDir, icon));
    }
    setProcessValue("resourcesPath", resourcesPath);
    setProcessValue("platform", "linux");
    process.env.XDG_DATA_HOME = dataHome;
    delete process.env.APPIMAGE;
    electronMocks.isPackaged = true;
    electronMocks.appPath = PROJECT_ROOT;
    // A child process that never exits: the refresh is fire-and-forget
    spawnMock.mockReset().mockReturnValue(new EventTarget());
  });

  afterEach(() => {
    setProcessValue("platform", originalPlatform);
    setProcessValue("resourcesPath", originalResourcesPath);
    setProcessValue("execPath", originalExecPath);
    process.env = { ...originalEnv };
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("windowIconPath()", () => {
    test("uses the shipped logo in a packaged Linux build, independent of cwd", () => {
      const cwd = process.cwd();
      process.chdir(os.tmpdir());
      try {
        const icon = windowIconPath();
        expect(icon).toBe(path.join(resourcesPath, "web", "public", "256x256.png"));
        expect(fs.existsSync(icon)).toBe(true);
      } finally {
        process.chdir(cwd);
      }
    });

    test("uses the logo from the project sources in development mode", () => {
      electronMocks.isPackaged = false;
      const icon = windowIconPath();
      expect(icon).toBe(path.join(PROJECT_ROOT, "public", "256x256.png"));
      expect(fs.existsSync(icon)).toBe(true);
    });

    test("uses an existing .ico logo in a packaged Windows build", () => {
      setProcessValue("platform", "win32");
      const icon = windowIconPath();
      expect(icon).toBe(path.join(resourcesPath, "web", "public", "favicon.ico"));
      expect(fs.existsSync(icon)).toBe(true);
    });
  });

  describe("desktopEntryContent()", () => {
    test("launches the AppImage with --no-sandbox and passes files through", () => {
      const content = desktopEntryContent({
        execPath: APPIMAGE,
        iconPath: "/i.png",
        isAppImage: true,
      });
      expect(content.startsWith("[Desktop Entry]\n")).toBe(true);
      expect(content).toContain(`Exec="${APPIMAGE}" --no-sandbox %U`);
      expect(content).toContain("Icon=/i.png");
      expect(content).toContain(`Name=Vease\n`);
      expect(content).toContain(`StartupWMClass=vease\n${DESKTOP_ENTRY_MARKER}\n`);
    });

    test("escapes special characters in the executable path", () => {
      const execPath = '/opt/my "app"/$v`x`\\100%/vease';
      const content = desktopEntryContent({ execPath, iconPath: "/i.png", isAppImage: false });
      // Desktop Entry spec: quote-escape " ` $ \, then string-escape every \ again; % becomes %%
      expect(content).toContain(
        'Exec="/opt/my \\\\"app\\\\"/\\\\$v\\\\`x\\\\`\\\\\\\\100%%/vease" %U',
      );
    });
  });

  describe("registerLinuxDesktopEntry()", () => {
    test("writes a launcher entry and icon pointing at the running AppImage", async () => {
      process.env.APPIMAGE = APPIMAGE;
      await registerLinuxDesktopEntry();

      const content = fs.readFileSync(desktopFile(), "utf8");
      expect(content).toContain(`Exec="${APPIMAGE}" --no-sandbox %U`);
      expect(content).toContain(`Icon=${iconFile()}`);
      expect(fs.readFileSync(iconFile())).toStrictEqual(
        fs.readFileSync(path.join(PROJECT_ROOT, "public", "256x256.png")),
      );
      expect(spawnMock).toHaveBeenCalledWith(
        "update-desktop-database",
        [path.dirname(desktopFile())],
        { stdio: "ignore" },
      );
    });

    test("launches the running executable outside an AppImage", async () => {
      // Pinned so the test does not depend on the host's (e.g. Windows) executable path
      setProcessValue("execPath", "/opt/Vease/vease");
      await registerLinuxDesktopEntry();
      expect(fs.readFileSync(desktopFile(), "utf8")).toContain('Exec="/opt/Vease/vease" %U');
    });

    test("updates an entry pointing at an older package location", async () => {
      process.env.APPIMAGE = "/old/Vease.AppImage";
      await registerLinuxDesktopEntry();
      process.env.APPIMAGE = "/new/Vease.AppImage";
      await registerLinuxDesktopEntry();

      const content = fs.readFileSync(desktopFile(), "utf8");
      expect(content).toContain('Exec="/new/Vease.AppImage" --no-sandbox %U');
      expect(content).not.toContain("/old/");
    });

    test("does not rewrite files already up to date", async () => {
      await registerLinuxDesktopEntry();
      const past = new Date("2020-01-01T00:00:00Z");
      fs.utimesSync(desktopFile(), past, past);
      fs.utimesSync(iconFile(), past, past);
      spawnMock.mockClear();

      await registerLinuxDesktopEntry();

      expect(fs.statSync(desktopFile()).mtime).toStrictEqual(past);
      expect(fs.statSync(iconFile()).mtime).toStrictEqual(past);
      expect(spawnMock).not.toHaveBeenCalled();
    });

    test("does nothing in development mode or on other platforms", async () => {
      electronMocks.isPackaged = false;
      await registerLinuxDesktopEntry();
      electronMocks.isPackaged = true;
      setProcessValue("platform", "win32");
      await registerLinuxDesktopEntry();
      expect(fs.existsSync(dataHome)).toBe(false);
    });

    test("leaves a vease.desktop entry it did not create untouched", async () => {
      fs.mkdirSync(path.dirname(desktopFile()), { recursive: true });
      fs.writeFileSync(desktopFile(), "[Desktop Entry]\nName=Custom\n");
      await registerLinuxDesktopEntry();
      expect(fs.readFileSync(desktopFile(), "utf8")).toBe("[Desktop Entry]\nName=Custom\n");
    });

    test("falls back to ~/.local/share when XDG_DATA_HOME is unset", async () => {
      delete process.env.XDG_DATA_HOME;
      process.env.HOME = tmpDir;
      await registerLinuxDesktopEntry();
      const entry = path.join(tmpDir, ".local", "share", "applications", "vease.desktop");
      expect(fs.existsSync(entry)).toBe(true);
    });

    test("never throws when the data directory is not writable", async () => {
      fs.writeFileSync(dataHome, "not a directory");
      await expect(registerLinuxDesktopEntry()).resolves.toBeUndefined();
    });
  });
});
