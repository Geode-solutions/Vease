// Node imports
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

// Third party imports
import { app } from "electron";
import { consola } from "consola";

// Local constants
const APP_ID = "vease";
const LINUX_ICON = "256x256.png";
const WINDOWS_ICON = "favicon.ico";
const ICON_SIZE = "256x256";
const DESKTOP_ENTRY_MARKER = "X-Vease-Generated=true";
const ICON_HASH_LENGTH = 12;

// Absolute path of the folder holding the app's public assets, independent of the cwd
function publicFolder(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "web", "public");
  }
  return path.join(app.getAppPath(), "public");
}

function windowIconPath(): string {
  const iconName = process.platform === "win32" ? WINDOWS_ICON : LINUX_ICON;
  return path.join(publicFolder(), iconName);
}

// Quote an Exec argument per the Desktop Entry specification:
// Backslash-escape " ` $ \ inside double quotes, then apply the string-level
// Escape of backslashes, and double % to keep it out of field-code expansion.
function quoteExecArg(arg: string): string {
  const quoted = arg.replaceAll(/["`$\\]/gu, String.raw`\$&`);
  return `"${quoted.replaceAll("\\", String.raw`\\`).replaceAll("%", "%%")}"`;
}

function desktopEntryContent(options: {
  execPath: string;
  iconPath: string;
  isAppImage: boolean;
}): string {
  // AppImages can't use Chromium's setuid sandbox, matching electron-builder's own entry
  const sandboxFlag = options.isAppImage ? " --no-sandbox" : "";
  return [
    "[Desktop Entry]",
    "Type=Application",
    "Name=Vease",
    "Comment=Desktop and cloud software for data visualization",
    `Exec=${quoteExecArg(options.execPath)}${sandboxFlag} %U`,
    `Icon=${options.iconPath}`,
    "Terminal=false",
    "Categories=Science;",
    `StartupWMClass=${APP_ID}`,
    DESKTOP_ENTRY_MARKER,
    "",
  ].join("\n");
}

function dataHome(): string {
  const xdgDataHome = process.env.XDG_DATA_HOME;
  if (xdgDataHome !== undefined && path.isAbsolute(xdgDataHome)) {
    return xdgDataHome;
  }
  return path.join(process.env.HOME ?? os.homedir(), ".local", "share");
}

async function readOrUndefined(filePath: string): Promise<Buffer | undefined> {
  try {
    return await fs.readFile(filePath);
  } catch {
    return undefined;
  }
}

async function writeIfChanged(filePath: string, content: Buffer): Promise<boolean> {
  const existing = await readOrUndefined(filePath);
  if (existing !== undefined && existing.equals(content)) {
    return false;
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
  return true;
}

// Shells cache icons by path: a file named after its content gives a new logo a new path
async function installIcon(iconDir: string): Promise<string> {
  const icon = await fs.readFile(path.join(publicFolder(), LINUX_ICON));
  const hash = createHash("sha256").update(icon).digest("hex").slice(0, ICON_HASH_LENGTH);
  const iconFile = path.join(iconDir, `${APP_ID}-${hash}.png`);
  await writeIfChanged(iconFile, icon);
  return iconFile;
}

// Icons from previous logos, including the fixed-name vease.png of older versions
async function removeStaleIcons(iconFile: string): Promise<void> {
  const iconDir = path.dirname(iconFile);
  const stalePattern = new RegExp(`^${APP_ID}(?:-[0-9a-f]{${ICON_HASH_LENGTH}})?\\.png$`, "u");
  const entries = await fs.readdir(iconDir);
  await Promise.all(
    entries
      .filter((entry) => entry !== path.basename(iconFile) && stalePattern.test(entry))
      .map(async (entry) => {
        await fs.rm(path.join(iconDir, entry), { force: true });
      }),
  );
}

async function refreshDesktopDatabase(applicationsDir: string): Promise<void> {
  try {
    const child = spawn("update-desktop-database", [applicationsDir], { stdio: "ignore" });
    await once(child, "exit");
  } catch (error) {
    consola.debug("update-desktop-database unavailable", error);
  }
}

// Install a per-user launcher entry and icon so Linux shells (notably on
// Wayland, which ignores window icons) show the Vease logo for its windows.
async function registerLinuxDesktopEntry(): Promise<void> {
  if (process.platform !== "linux" || !app.isPackaged) {
    return;
  }
  try {
    const applicationsDir = path.join(dataHome(), "applications");
    const desktopFile = path.join(applicationsDir, `${APP_ID}.desktop`);
    const iconDir = path.join(dataHome(), "icons", "hicolor", ICON_SIZE, "apps");

    const existingEntry = await readOrUndefined(desktopFile);
    if (existingEntry && !existingEntry.toString("utf8").includes(DESKTOP_ENTRY_MARKER)) {
      consola.info(`Keeping launcher entry not created by Vease: ${desktopFile}`);
      return;
    }

    const iconFile = await installIcon(iconDir);

    const appImage = process.env.APPIMAGE;
    const isAppImage = appImage !== undefined && appImage !== "";
    const entry = desktopEntryContent({
      execPath: isAppImage ? appImage : process.execPath,
      iconPath: iconFile,
      isAppImage,
    });
    if (await writeIfChanged(desktopFile, Buffer.from(entry, "utf8"))) {
      consola.info(`Registered launcher entry: ${desktopFile}`);
      void refreshDesktopDatabase(applicationsDir);
    }
    await removeStaleIcons(iconFile);
  } catch (error) {
    consola.warn("Could not register the Vease launcher entry", error);
  }
}

export { DESKTOP_ENTRY_MARKER, desktopEntryContent, registerLinuxDesktopEntry, windowIconPath };
