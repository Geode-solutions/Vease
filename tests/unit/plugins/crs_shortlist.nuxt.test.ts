import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { AppSettings } from "~~/electron/app_settings_utils";
import crsShortlistPlugin from "@vease/plugins/crs_shortlist.client";
import { nextTick } from "vue";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrsShortlist } from "@ogw_front/composables/crs_shortlist";

vi.setConfig({ testTimeout: 10_000 });

const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
const UTM = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };

describe("crs_shortlist plugin", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "electronAPI");
  });

  test("the crs shortlist reads the desktop settings", async () => {
    Object.assign(globalThis, {
      electronAPI: {
        app_settings: { crsFavorites: [LAMBERT] },
        app_settings_write: vi.fn<(settings: AppSettings) => Promise<unknown>>(),
      },
    });
    await crsShortlistPlugin(useNuxtApp());

    expect(useCrsShortlist().favorites.value).toStrictEqual([LAMBERT]);
  });

  test("the crs shortlist saves every change, not only the first one", async () => {
    const sent: unknown[] = [];
    // Electron copies every message with the structured clone algorithm, which refuses Vue proxies
    const writeSettings = vi.fn<(settings: AppSettings) => Promise<unknown>>(async (settings) => {
      sent.push(structuredClone(settings));
      await Promise.resolve();
    });
    Object.assign(globalThis, {
      electronAPI: { app_settings: {}, app_settings_write: writeSettings },
    });
    await crsShortlistPlugin(useNuxtApp());
    const { recordUse, toggleFavorite } = useCrsShortlist();

    recordUse(LAMBERT);
    await nextTick();
    recordUse(UTM);
    toggleFavorite(LAMBERT);
    await nextTick();
    toggleFavorite(UTM);
    await nextTick();
    expect(sent.at(-1)).toStrictEqual({ crsFavorites: [LAMBERT, UTM] });
    expect(sent).toContainEqual({ crsHistory: [UTM, LAMBERT] });
  });
});
