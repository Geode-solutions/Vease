import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { AppSettings } from "~~/electron/app_settings_utils";
import { nextTick } from "vue";
import { useAppSetting } from "@vease/composables/app_setting";

vi.setConfig({ testTimeout: 10_000 });

const STORAGE_KEY = "vease-crs-history";
const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
const UTM = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };

describe("app setting", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("reads and writes a list in the local storage", async () => {
    const setting = useAppSetting("crsHistory", STORAGE_KEY, []);

    setting.value.push(LAMBERT);
    await nextTick();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify([LAMBERT]));
  });

  test("falls back on a corrupted stored value", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(useAppSetting("crsHistory", STORAGE_KEY, []).value).toStrictEqual([]);
    localStorage.setItem(STORAGE_KEY, '[{"code":1}]');
    expect(useAppSetting("crsHistory", STORAGE_KEY, []).value).toStrictEqual([]);
  });

  test("shares one value between callers", async () => {
    const first = useAppSetting("crsFavorites", "vease-crs-favorites", []);
    const second = useAppSetting("crsFavorites", "vease-crs-favorites", []);

    first.value = [LAMBERT];
    await nextTick();
    expect(second.value).toStrictEqual([LAMBERT]);
  });
});

describe("app setting on desktop", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "electronAPI");
  });

  test("reads and writes the desktop settings", async () => {
    const writeSettings = vi.fn<(settings: AppSettings) => Promise<unknown>>();
    Object.assign(globalThis, {
      electronAPI: { app_settings: { crsHistory: [LAMBERT] }, app_settings_write: writeSettings },
    });
    const setting = useAppSetting("crsHistory", STORAGE_KEY, []);

    expect(setting.value).toStrictEqual([LAMBERT]);
    setting.value.push(UTM);
    await nextTick();
    expect(writeSettings).toHaveBeenCalledWith({ crsHistory: [LAMBERT, UTM] });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test("sends a value the desktop messages can copy", async () => {
    const sent: unknown[] = [];
    // Electron copies every message with the structured clone algorithm, which refuses Vue proxies
    const writeSettings = vi.fn<(settings: AppSettings) => Promise<unknown>>(async (settings) => {
      sent.push(structuredClone(settings));
      await Promise.resolve();
    });
    Object.assign(globalThis, {
      electronAPI: { app_settings: { crsHistory: [LAMBERT] }, app_settings_write: writeSettings },
    });
    const setting = useAppSetting("crsHistory", STORAGE_KEY, []);

    setting.value.push(UTM);
    await nextTick();
    expect(sent).toStrictEqual([{ crsHistory: [LAMBERT, UTM] }]);
  });

  test("shares one value between callers", () => {
    Object.assign(globalThis, {
      electronAPI: { app_settings: {}, app_settings_write: vi.fn<() => Promise<unknown>>() },
    });

    expect(useAppSetting("crsFavorites", "vease-crs-favorites", [])).toBe(
      useAppSetting("crsFavorites", "vease-crs-favorites", []),
    );
  });
});
