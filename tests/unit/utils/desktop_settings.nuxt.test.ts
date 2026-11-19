// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Local imports
import { SETTINGS_FILE, readAppSettings, writeAppSettings } from "~~/utils/desktop_settings";
import { sanitizeAppSettings } from "~~/electron/app_settings_utils";

vi.setConfig({ testTimeout: 10_000 });

describe("desktop settings (electron main process)", () => {
  let tmpDir = "";
  let userDataPath = "";

  function settingsPath(): string {
    return path.join(userDataPath, SETTINGS_FILE);
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vease-settings-"));
    userDataPath = path.join(tmpDir, "userData");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test("has no settings before the first save", () => {
    expect(readAppSettings(userDataPath)).toStrictEqual({});
  });

  test("saves the settings and reads them at next launch", () => {
    writeAppSettings(userDataPath, { colorTheme: "dark" });
    expect(readAppSettings(userDataPath)).toStrictEqual({ colorTheme: "dark" });
  });

  test("merges a change into the saved settings", () => {
    fs.mkdirSync(userDataPath);
    fs.writeFileSync(settingsPath(), JSON.stringify({ colorTheme: "dark" }));
    expect(writeAppSettings(userDataPath, {})).toStrictEqual({ colorTheme: "dark" });
    expect(writeAppSettings(userDataPath, { colorTheme: "light" })).toStrictEqual({
      colorTheme: "light",
    });
  });

  test("ignores a corrupted settings file", () => {
    fs.mkdirSync(userDataPath);
    fs.writeFileSync(settingsPath(), "{not json");
    expect(readAppSettings(userDataPath)).toStrictEqual({});
  });

  test("keeps only the known and valid settings", () => {
    expect(sanitizeAppSettings({ colorTheme: "solarized", other: 1 })).toStrictEqual({});
    expect(sanitizeAppSettings({ colorTheme: "light", other: 1 })).toStrictEqual({
      colorTheme: "light",
    });
    expect(sanitizeAppSettings("dark")).toStrictEqual({});
  });
});
