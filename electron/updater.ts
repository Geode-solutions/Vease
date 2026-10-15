// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { BrowserWindow, app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { consola } from "consola";

// Local imports
import {
  type UpdateChannel,
  type UpdateSettings,
  defaultChannel,
  listStableVersions,
  selectTargetTag,
} from "./updater_utils";

type UpdaterState =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "downloaded"
  | "error"
  | "unsupported";

interface UpdaterStatus {
  state: UpdaterState;
  version?: string;
  percent?: number;
  bytesPerSecond?: number;
  transferred?: number;
  total?: number;
  message?: string;
}

const GITHUB_REPO = "Geode-solutions/Vease";
const RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100`;
const RELEASES_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/releases/download`;

// Resolved lazily so the e2e userData isolation in utils/desktop.ts is applied first
function settingsFilePath(): string {
  return path.join(app.getPath("userData"), "update-settings.json");
}

let lastStatus: UpdaterStatus = { state: "idle" };
let cachedTags: string[] | undefined = undefined;

function setStatus(status: UpdaterStatus): void {
  lastStatus = status;
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send("updater_status", status);
  }
}

function unsupportedReason(): string | undefined {
  if (!app.isPackaged) {
    return "Updates are disabled in development builds";
  }
  if (process.platform === "linux" && (process.env.APPIMAGE ?? "") === "") {
    return "Updates are only supported for the AppImage build";
  }
  return undefined;
}

function isChannel(value: unknown): value is UpdateChannel {
  return value === "master" || value === "next";
}

function readField(value: unknown, key: string): unknown {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const field: unknown = Reflect.get(value, key);
  return field;
}

function sanitizeSettings(raw: unknown, fallbackChannel: UpdateChannel): UpdateSettings {
  const channel = readField(raw, "channel");
  const pinnedVersion = readField(raw, "pinnedVersion");
  const settings: UpdateSettings = { channel: isChannel(channel) ? channel : fallbackChannel };
  if (typeof pinnedVersion === "string" && pinnedVersion !== "") {
    settings.pinnedVersion = pinnedVersion;
  }
  return settings;
}

function readSettings(): UpdateSettings {
  const fallbackChannel = defaultChannel(app.getVersion());
  if (!fs.existsSync(settingsFilePath())) {
    return { channel: fallbackChannel };
  }
  try {
    const raw: unknown = JSON.parse(fs.readFileSync(settingsFilePath(), "utf8"));
    return sanitizeSettings(raw, fallbackChannel);
  } catch (error) {
    consola.warn("[Updater] Invalid update settings, using defaults", error);
    return { channel: fallbackChannel };
  }
}

function writeSettings(settings: UpdateSettings): void {
  fs.writeFileSync(settingsFilePath(), JSON.stringify(settings, undefined, 2));
}

async function fetchReleaseTags(): Promise<string[]> {
  if (cachedTags !== undefined) {
    return cachedTags;
  }
  const response = await fetch(RELEASES_API_URL, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) {
    throw new Error(`GitHub releases request failed: ${response.status} ${response.statusText}`);
  }
  const releases: unknown = await response.json();
  if (!Array.isArray(releases)) {
    throw new TypeError("Unexpected GitHub releases response");
  }
  cachedTags = releases
    .filter((release) => readField(release, "draft") !== true)
    .map((release) => readField(release, "tag_name"))
    .filter((tag): tag is string => typeof tag === "string");
  return cachedTags;
}

async function checkForUpdates(): Promise<void> {
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
    const tag = selectTargetTag(await fetchReleaseTags(), settings);
    if (tag === undefined) {
      throw new Error(
        settings.pinnedVersion === undefined
          ? `No release found for channel ${settings.channel}`
          : `Version ${settings.pinnedVersion} was not found`,
      );
    }
    consola.info(`[Updater] Channel ${settings.channel}, target release ${tag}`);
    autoUpdater.setFeedURL({ provider: "generic", url: `${RELEASES_DOWNLOAD_URL}/${tag}` });
    await autoUpdater.checkForUpdates();
  } catch (error) {
    consola.error("[Updater] Update check failed", error);
    setStatus({ state: "error", message: error instanceof Error ? error.message : String(error) });
  }
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
    setStatus({ state: "downloaded", version: info.version });
  });
  autoUpdater.on("error", (error) => {
    setStatus({ state: "error", message: error.message });
  });
}

function registerUpdaterHandlers(): void {
  ipcMain.handle("updater_get_state", () => {
    const { channel, pinnedVersion } = readSettings();
    return { currentVersion: app.getVersion(), channel, pinnedVersion, status: lastStatus };
  });

  ipcMain.handle("updater_list_versions", async () => {
    try {
      return listStableVersions(await fetchReleaseTags());
    } catch (error) {
      consola.error("[Updater] Cannot list versions", error);
      return [];
    }
  });

  ipcMain.handle("updater_set_settings", async (_event, settings: unknown) => {
    writeSettings(sanitizeSettings(settings, readSettings().channel));
    await checkForUpdates();
  });

  ipcMain.handle("updater_check", async () => {
    await checkForUpdates();
  });

  ipcMain.handle("updater_quit_and_install", () => {
    autoUpdater.quitAndInstall();
  });
}

function initUpdater({ autoCheck }: { autoCheck: boolean }): void {
  registerUpdaterEvents();
  registerUpdaterHandlers();
  const reason = unsupportedReason();
  if (reason !== undefined) {
    lastStatus = { state: "unsupported", message: reason };
    return;
  }
  if (autoCheck) {
    void checkForUpdates();
  }
}

export { initUpdater, type UpdaterState, type UpdaterStatus };
