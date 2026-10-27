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
  type UpdaterInitialState,
  type UpdaterStatus,
  defaultChannel,
  listStableVersions,
  selectChannelTag,
  tagForVersion,
} from "./updater_utils";

const GITHUB_REPO = "Geode-solutions/Vease";
const RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
const RELEASES_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/releases/download`;
const RELEASES_PER_PAGE = 100;
// Bounds the unauthenticated GitHub API usage (60 requests per hour) when listing versions
const MAX_RELEASE_PAGES = 10;
const VERSION_LIST_TTL_MS = 600_000;
const HTTP_NOT_FOUND = 404;
// The NSIS installer drops "Uninstall <productName>.exe" next to the app executable
const NSIS_UNINSTALLER_REGEX = /^Uninstall .+\.exe$/iu;

// Resolved lazily so the e2e userData isolation in utils/desktop.ts is applied first
function settingsFilePath(): string {
  return path.join(app.getPath("userData"), "update-settings.json");
}

let lastStatus: UpdaterStatus = { state: "idle" };
let versionListCache: { versions: string[]; fetchedAt: number } | undefined = undefined;
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

async function fetchGitHub(url: string): Promise<Response> {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  return response;
}

function requestError(response: Response): Error {
  return new Error(`GitHub releases request failed: ${response.status} ${response.statusText}`);
}

async function fetchReleasesPage(page: number): Promise<unknown[]> {
  const response = await fetchGitHub(
    `${RELEASES_API_URL}?per_page=${RELEASES_PER_PAGE}&page=${page}`,
  );
  if (!response.ok) {
    throw requestError(response);
  }
  const releases: unknown = await response.json();
  if (!Array.isArray(releases)) {
    throw new TypeError("Unexpected GitHub releases response");
  }
  const releaseList: unknown[] = releases;
  return releaseList;
}

// GitHub lists releases newest first, so later pages are only needed for the full version list
async function fetchReleasesFrom(page: number): Promise<unknown[]> {
  const releases = await fetchReleasesPage(page);
  if (releases.length < RELEASES_PER_PAGE || page >= MAX_RELEASE_PAGES) {
    return releases;
  }
  return [...releases, ...(await fetchReleasesFrom(page + 1))];
}

function releaseTags(releases: unknown[]): string[] {
  return releases
    .filter((release) => readField(release, "draft") !== true)
    .map((release) => readField(release, "tag_name"))
    .filter((tag): tag is string => typeof tag === "string");
}

async function releaseExists(tag: string): Promise<boolean> {
  const response = await fetchGitHub(`${RELEASES_API_URL}/tags/${encodeURIComponent(tag)}`);
  if (response.status === HTTP_NOT_FOUND) {
    return false;
  }
  if (!response.ok) {
    throw requestError(response);
  }
  return true;
}

async function listVersions(): Promise<string[]> {
  if (versionListCache && Date.now() - versionListCache.fetchedAt < VERSION_LIST_TTL_MS) {
    return versionListCache.versions;
  }
  const versions = listStableVersions(releaseTags(await fetchReleasesFrom(1)));
  versionListCache = { versions, fetchedAt: Date.now() };
  return versions;
}

// Always queries GitHub so a check never misses a release published while the app was open
async function resolveTargetTag(settings: UpdateSettings): Promise<string> {
  if (settings.pinnedVersion !== undefined) {
    const tag = tagForVersion(settings.pinnedVersion);
    if (!(await releaseExists(tag))) {
      throw new Error(`Version ${settings.pinnedVersion} was not found`);
    }
    return tag;
  }
  const tag = selectChannelTag(releaseTags(await fetchReleasesPage(1)), settings.channel);
  if (tag === undefined) {
    throw new Error(`No release found for channel ${settings.channel}`);
  }
  return tag;
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
