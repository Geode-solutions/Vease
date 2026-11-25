import { darkTheme, lightTheme } from "@vease/utils/brand_themes";
import { describe, expect, test, vi } from "vitest";

vi.setConfig({ testTimeout: 10_000 });

const ACTIVITY_TOKENS = [
  "activity-viewer",
  "on-activity-viewer",
  "activity-extension",
  "on-activity-extension",
];

describe("brand themes", () => {
  test("both themes define the activity source colors", () => {
    for (const theme of [lightTheme, darkTheme]) {
      expect(Object.keys(theme.colors)).toStrictEqual(expect.arrayContaining(ACTIVITY_TOKENS));
    }
  });
});
