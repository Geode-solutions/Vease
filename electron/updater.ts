// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { BrowserWindow, app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { consola } from "consola";

// Local imports
import { RELEASES_DOWNLOAD_URL, listVersions, resolveTargetTag } from "./updater_releases";
import type { UpdaterInitialState, UpdaterStatus } from "./updater_utils";
import { readSettings, sanitizeSettings, writeSettings } from "./updater_settings";

// The NSIS installer drops "Uninstall <productName>.exe" next to the app executable
const NSIS_UNINSTALLER_REGEX = /^Uninstall .+\.exe$/iu;

let lastStatus: UpdaterStatus = { state: "idle" };
// Checks run one after the other so a settings change never swaps the feed during a download
let pendingCheck: Promise<void> = Promise.resolve();

function setStatus(status: UpdaterStatus): void {
  lastStatus = status;
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send("updater_status", status);
  }
}

function isNsisInstall(): boolean {
  const installDir = path.dirname(app.getPath("exe"));
  return fs.readdirSync(installDir).some((file) => NSIS_UNINSTALLER_REGEX.test(file));
}

function unsupportedReason(): string | undefined {
  if (!app.isPackaged) {
    return "Updates are disabled in development builds";
  }
  if (process.platform === "linux" && (process.env.APPIMAGE ?? "") === "") {
    return "Updates are only supported for the AppImage build";
  }
  if (process.platform === "win32" && !isNsisInstall()) {
    return "Updates are only supported for the installer build";
  }
  return undefined;
}

async function runCheck(): Promise<void> {
  const reason = unsupportedReason();
  if (reason !== undefined) {
    setStatus({ state: "unsupported", message: reason });
    return;
  }
  const settings = readSettings();
  if (settings.pinnedVersion === app.getVersion()) {
    consola.info(`[Updater] Pinned to ${settings.pinnedVersion}, skipping update check`);
    setStatus({ state: "not-available", version: settings.pinnedVersion });
    return;
  }
  try {
    setStatus({ state: "checking" });
    const tag = await resolveTargetTag(settings);
    consola.info(`[Updater] Channel ${settings.channel}, target release ${tag}`);
    autoUpdater.setFeedURL({ provider: "generic", url: `${RELEASES_DOWNLOAD_URL}/${tag}` });
    const result = await autoUpdater.checkForUpdates();
    await result?.downloadPromise;
  } catch (error) {
    consola.error("[Updater] Update check failed", error);
    setStatus({ state: "error", message: error instanceof Error ? error.message : String(error) });
  }
}

async function checkForUpdates(): Promise<void> {
  const previousCheck = pendingCheck;
  pendingCheck = (async (): Promise<void> => {
    await previousCheck;
    await runCheck();
  })();
  await pendingCheck;
}

function registerUpdaterEvents(): void {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  // Needed to switch from next to master or to pin an older version
  autoUpdater.allowDowngrade = true;
  autoUpdater.logger = consola;

  autoUpdater.on("checking-for-update", () => {
    setStatus({ state: "checking" });
  });
  autoUpdater.on("update-available", (info) => {
    setStatus({ state: "available", version: info.version });
  });
  autoUpdater.on("update-not-available", (info) => {
    setStatus({ state: "not-available", version: info.version });
  });
  autoUpdater.on("download-progress", (progress) => {
    setStatus({
      state: "downloading",
      version: lastStatus.version,
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    });
  });
  autoUpdater.on("update-downloaded", (info) => {
    autoUpdater.autoInstallOnAppQuit = true;
    setStatus({ state: "downloaded", version: info.version });
  });
  autoUpdater.on("error", (error) => {
    setStatus({ state: "error", message: error.message });
  });
}

async function quitAndInstall(beforeInstall: () => Promise<void>): Promise<void> {
  // The installer closes the running app, so the backend must be stopped before it starts
  try {
    await beforeInstall();
  } catch (error) {
    consola.error("[Updater] Cleanup before install failed", error);
    setStatus({ state: "error", message: "Could not stop Vease services before installing" });
    return;
  }
  autoUpdater.quitAndInstall();
}

function registerUpdaterHandlers(beforeInstall: () => Promise<void>): void {
  ipcMain.handle("updater_get_state", (): UpdaterInitialState => {
    const { channel, pinnedVersion } = readSettings();
    return { channel, pinnedVersion, status: lastStatus };
  });

  ipcMain.handle("updater_list_versions", async () => {
    try {
      return await listVersions();
    } catch (error) {
      consola.error("[Updater] Cannot list versions", error);
      return [];
    }
  });

  ipcMain.handle("updater_set_settings", async (_event, settings: unknown) => {
    writeSettings(sanitizeSettings(settings, readSettings().channel));
    // An update staged for the previous target must not be installed on quit; the next
    // Download re-enables it
    autoUpdater.autoInstallOnAppQuit = false;
    await checkForUpdates();
  });

  ipcMain.handle("updater_check", async () => {
    await checkForUpdates();
  });

  ipcMain.handle("updater_quit_and_install", async () => {
    await quitAndInstall(beforeInstall);
  });
}

function initUpdater({
  autoCheck,
  beforeInstall,
}: {
  autoCheck: boolean;
  beforeInstall: () => Promise<void>;
}): void {
  registerUpdaterEvents();
  registerUpdaterHandlers(beforeInstall);
  const reason = unsupportedReason();
  if (reason !== undefined) {
    lastStatus = { state: "unsupported", message: reason };
    return;
  }
  if (autoCheck) {
    void checkForUpdates();
  }
}

export { initUpdater };
