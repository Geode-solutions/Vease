import {
  compareVersions,
  defaultChannel,
  listStableVersions,
  parseTag,
  selectChannelTag,
  tagForVersion,
} from "~~/electron/updater_utils";
import { describe, expect, test, vi } from "vitest";

vi.setConfig({ testTimeout: 10_000 });

const TAGS = [
  "v1.53.4",
  "v1.53.4-rc.2",
  "v1.53.4-rc.1",
  "v1.53.3",
  "feat/complete_controller-tag",
  "feat/pvd_import-tag",
  "v1.53.5-rc.1",
  "v1.52.0",
];

describe("the updater utils", () => {
  test("parseTag parses stable and rc tags, rejects others", () => {
    expect(parseTag("v1.53.4")).toStrictEqual({ major: 1, minor: 53, patch: 4 });
    expect(parseTag("v1.53.4-rc.2")).toStrictEqual({
      major: 1,
      minor: 53,
      patch: 4,
      releaseCandidate: 2,
    });
    expect(parseTag("feat/pvd_import-tag")).toBeUndefined();
    expect(parseTag("v1.53.4-beta.1")).toBeUndefined();
  });

  test("compareVersions orders stable after its release candidates", () => {
    const ordered = ["1.53.3", "1.53.4-rc.1", "1.53.4-rc.2", "1.53.4"];
    expect(ordered.toSorted(compareVersions)).toStrictEqual(ordered);
    expect(
      ["1.53.4", "1.53.3", "1.53.4-rc.10", "1.53.4-rc.2"].toSorted(compareVersions),
    ).toStrictEqual(["1.53.3", "1.53.4-rc.2", "1.53.4-rc.10", "1.53.4"]);
  });

  test("selectChannelTag picks the newest stable on master", () => {
    expect(selectChannelTag(TAGS, "master")).toBe("v1.53.4");
  });

  test("selectChannelTag picks the newest release on next", () => {
    expect(selectChannelTag(TAGS, "next")).toBe("v1.53.5-rc.1");
    expect(selectChannelTag(["v1.53.4", "v1.53.4-rc.2"], "next")).toBe("v1.53.4");
  });

  test("selectChannelTag returns undefined without a matching release", () => {
    expect(selectChannelTag(["v1.53.5-rc.1", "feat/pvd_import-tag"], "master")).toBeUndefined();
  });

  test("tagForVersion adds the v prefix once", () => {
    expect(tagForVersion("1.52.0")).toBe("v1.52.0");
    expect(tagForVersion("v1.52.0")).toBe("v1.52.0");
  });

  test("listStableVersions only lists stable versions, newest first", () => {
    expect(listStableVersions(TAGS)).toStrictEqual(["1.53.4", "1.53.3", "1.52.0"]);
  });

  test("defaultChannel follows the installed version", () => {
    expect(defaultChannel("1.53.4")).toBe("master");
    expect(defaultChannel("1.53.4-rc.2")).toBe("next");
  });
});
