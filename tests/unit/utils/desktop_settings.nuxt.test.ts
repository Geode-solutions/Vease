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

const LAMBERT = {
  authority: "EPSG",
  code: "2154",
  name: "RGF93 v1 / Lambert-93",
};

describe("desktop settings (electron main process)", () => {
  let tmpDir = "";
  let userDataPath = "";
  let settingsFile = "";

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vease-settings-"));
    userDataPath = path.join(tmpDir, "userData");
    settingsFile = path.join(userDataPath, SETTINGS_FILE);
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
    fs.writeFileSync(settingsFile, JSON.stringify({ colorTheme: "dark" }));
    expect(writeAppSettings(userDataPath, {})).toStrictEqual({
      colorTheme: "dark",
    });
    expect(writeAppSettings(userDataPath, { colorTheme: "light" })).toStrictEqual({
      colorTheme: "light",
    });
  });

  test("ignores a corrupted settings file", () => {
    fs.mkdirSync(userDataPath);
    fs.writeFileSync(settingsFile, "{not json");
    expect(readAppSettings(userDataPath)).toStrictEqual({});
  });

  test("keeps any setting of a settings object", () => {
    expect(sanitizeAppSettings({ colorTheme: "light", other: 1 })).toStrictEqual({
      colorTheme: "light",
      other: 1,
    });
    expect(sanitizeAppSettings("dark")).toStrictEqual({});
    expect(sanitizeAppSettings([1])).toStrictEqual({});
  });

  test("leaves no temporary file after a save", () => {
    writeAppSettings(userDataPath, { colorTheme: "dark" });
    expect(fs.readdirSync(userDataPath)).toStrictEqual([SETTINGS_FILE]);
  });

  test("saves the crs favorites next to the color theme", () => {
    writeAppSettings(userDataPath, { colorTheme: "dark" });
    writeAppSettings(userDataPath, { crsFavorites: [LAMBERT] });
    expect(readAppSettings(userDataPath)).toStrictEqual({
      colorTheme: "dark",
      crsFavorites: [LAMBERT],
    });
  });
});
