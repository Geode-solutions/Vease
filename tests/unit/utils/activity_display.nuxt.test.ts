import { describe, expect, test, vi } from "vitest";
import {
  formatDuration,
  formatTime,
  matchesSearch,
  routeParts,
  shortRoute,
  sortSources,
} from "@vease/utils/activity_display";
import type { ActivityEntry } from "@ogw_front/stores/activity";

vi.setConfig({ testTimeout: 10_000 });

const FAST_MS = 812;
const SLOW_MS = 3240;
const YEAR = 2026;
const HOURS = 14;
const MINUTES = 2;
const SECONDS = 5;
const MILLISECONDS = 7;

const entry: ActivityEntry = {
  id: 1,
  source: "back",
  kind: "http",
  route: "opengeodeweb_back/data_missing_files",
  status: "error",
  started_at: 0,
  params: '{"filename":"horizons.og_hst3d"}',
  error: "Request timed out",
};

describe("activity display", () => {
  test("routes lose their microservice prefix", () => {
    expect(shortRoute("opengeodeweb_back/upload_file")).toBe("upload_file");
    expect(shortRoute("vease_back/packages_versions")).toBe("packages_versions");
    expect(shortRoute("opengeodeweb_viewer.model.surfaces.color")).toBe("model.surfaces.color");
    expect(shortRoute("api/local/app/run_back")).toBe("local/app/run_back");
  });

  test("routes are split into a dimmed scope and a name", () => {
    expect(routeParts("opengeodeweb_viewer.model.surfaces.color")).toStrictEqual({
      scope: "model.",
      name: "surfaces.color",
    });
    expect(routeParts("api/local/app/run_back")).toStrictEqual({
      scope: "local/app/",
      name: "run_back",
    });
    expect(routeParts("opengeodeweb_back/upload_file")).toStrictEqual({
      scope: "",
      name: "upload_file",
    });
  });

  test("durations switch to seconds after one second", () => {
    expect(formatDuration(FAST_MS)).toBe("812 ms");
    expect(formatDuration(SLOW_MS)).toBe("3.2 s");
  });

  test("times show milliseconds", () => {
    const timestamp = new Date(YEAR, 0, 1, HOURS, MINUTES, SECONDS, MILLISECONDS).getTime();
    expect(formatTime(timestamp)).toBe("14:02:05.007");
  });

  test("known sources come first", () => {
    expect(sortSources(["vease-modeling", "viewer", "events", "back", "back"])).toStrictEqual([
      "back",
      "viewer",
      "events",
      "vease-modeling",
    ]);
  });

  test("search looks into route, params and error", () => {
    expect(matchesSearch(entry, "")).toBe(true);
    expect(matchesSearch(entry, "missing")).toBe(true);
    expect(matchesSearch(entry, "HORIZONS")).toBe(true);
    expect(matchesSearch(entry, "timed out")).toBe(true);
    expect(matchesSearch(entry, "viewer")).toBe(false);
  });
});
