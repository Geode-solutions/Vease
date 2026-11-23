// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { consola } from "consola";

// Local imports
// oxlint-disable-next-line import/no-relative-parent-imports
import { type AppSettings, sanitizeAppSettings } from "../electron/app_settings_utils";

// The Vease settings of the desktop app, kept in userData: each instance gets its own sessionData folder (browser
// Storage included), removed on quit (see desktop_session_data.ts)
const SETTINGS_FILE = "settings.json";

function readAppSettings(userDataPath: string): AppSettings {
  const settingsPath = path.join(userDataPath, SETTINGS_FILE);
  if (!fs.existsSync(settingsPath)) {
    return {};
  }
  try {
    const raw: unknown = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    return sanitizeAppSettings(raw);
  } catch (error) {
    consola.warn("[Electron] Invalid settings, using defaults", error);
    return {};
  }
}

// Merges the given settings into the saved ones and returns the result
function writeAppSettings(userDataPath: string, settings: unknown): AppSettings {
  const merged = { ...readAppSettings(userDataPath), ...sanitizeAppSettings(settings) };
  try {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.writeFileSync(path.join(userDataPath, SETTINGS_FILE), JSON.stringify(merged, undefined, 2));
  } catch (error) {
    consola.warn("[Electron] Failed to save settings", error);
  }
  return merged;
}

export { SETTINGS_FILE, readAppSettings, writeAppSettings };
