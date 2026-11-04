// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { app } from "electron";
import { consola } from "consola";

// Local imports
import { type UpdateChannel, type UpdateSettings, defaultChannel } from "./updater_utils";

// Resolved lazily so the e2e userData isolation in utils/desktop_user_data.ts is applied first
function settingsFilePath(): string {
  return path.join(app.getPath("userData"), "update-settings.json");
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

export { readField, readSettings, sanitizeSettings, writeSettings };
