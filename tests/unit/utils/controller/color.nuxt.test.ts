import { describe, expect, test, vi } from "vitest";
import { hexToRgba } from "@vease/utils/controller/color";

vi.setConfig({ testTimeout: 10_000 });

const HALF_ALPHA_BYTE = 128;
const BYTE_MAX = 255;
const HALF_ALPHA = HALF_ALPHA_BYTE / BYTE_MAX;

describe("the hex color conversion", () => {
  test("converts a 6-digit hex to an opaque color", () => {
    expect(hexToRgba("#ff8800")).toStrictEqual({ red: 255, green: 136, blue: 0, alpha: 1 });
  });

  test("converts an 8-digit hex with its alpha channel", () => {
    expect(hexToRgba("#ff880080")).toStrictEqual({
      red: 255,
      green: 136,
      blue: 0,
      alpha: HALF_ALPHA,
    });
  });
});
