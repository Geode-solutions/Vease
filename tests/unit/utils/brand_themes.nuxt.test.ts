import { darkTheme, lightTheme } from "@vease/utils/brand_themes";
import { describe, expect, test, vi } from "vitest";

vi.setConfig({ testTimeout: 10_000 });

const CONSOLE_TOKENS = [
  "console-viewer",
  "on-console-viewer",
  "console-extension",
  "on-console-extension",
];

describe("brand themes", () => {
  test("both themes define the console source colors", () => {
    for (const theme of [lightTheme, darkTheme]) {
      expect(Object.keys(theme.colors)).toStrictEqual(expect.arrayContaining(CONSOLE_TOKENS));
    }
  });
});
