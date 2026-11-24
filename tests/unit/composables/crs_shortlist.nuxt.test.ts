import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { AppSettings } from "~~/electron/app_settings_utils";
import type { CRS } from "@geode/opengeodeweb-back/schema_types";
import { nextTick } from "vue";
import { useCrsShortlist } from "@vease/composables/crs_shortlist";

vi.setConfig({ testTimeout: 10_000 });

const LAMBERT = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
const UTM = { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" };

function epsg(code: string): CRS {
  return { authority: "EPSG", code, name: `CRS ${code}` };
}

describe("crs shortlist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("records the used crs first, without duplicates, five at most", () => {
    const { recent, recordUse } = useCrsShortlist();
    for (const code of ["1", "2", "3", "4", "5", "6", "3"]) {
      recordUse(epsg(code));
    }
    expect(recent.value.map(({ code }) => code)).toStrictEqual(["3", "6", "5", "4", "2"]);
  });

  test("toggles a favorite", () => {
    const { favorites, toggleFavorite } = useCrsShortlist();
    toggleFavorite(LAMBERT);
    expect(favorites.value).toStrictEqual([LAMBERT]);
    toggleFavorite(LAMBERT);
    expect(favorites.value).toStrictEqual([]);
  });

  test("a favorite is not listed in the recent crs", () => {
    const { recent, recordUse, toggleFavorite } = useCrsShortlist();
    recordUse(LAMBERT);
    recordUse(UTM);
    toggleFavorite(LAMBERT);
    expect(recent.value).toStrictEqual([UTM]);
  });

  test("tells apart the same code of two authorities", () => {
    const { recent, recordUse } = useCrsShortlist();
    recordUse({
      authority: "EPSG",
      code: "4812",
      name: "New Beijing / 3-degree Gauss-Kruger CM 132E",
    });
    recordUse({ authority: "ESRI", code: "4812", name: "GCS_Voirol_Unifie_1960_Paris" });
    expect(recent.value).toHaveLength(2);
  });

  test("stores only the authority, code and name", async () => {
    const { recordUse } = useCrsShortlist();
    recordUse({ ...LAMBERT, extra: 1 } as CRS);
    await nextTick();
    expect(localStorage.getItem("vease-crs-history")).toBe(JSON.stringify([LAMBERT]));
  });
});

describe("crs shortlist on desktop", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "electronAPI");
  });

  test("saves every change, not only the first one", async () => {
    const sent: unknown[] = [];
    // Electron copies every message with the structured clone algorithm, which refuses Vue proxies
    const writeSettings = vi.fn<(settings: AppSettings) => Promise<unknown>>(async (settings) => {
      sent.push(structuredClone(settings));
      await Promise.resolve();
    });
    Object.assign(globalThis, {
      electronAPI: { app_settings: {}, app_settings_write: writeSettings },
    });
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
