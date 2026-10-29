import { describe, expect, test, vi } from "vitest";
import { distinctHexColors, hexToRgba } from "@vease/utils/controller/color";

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

describe("the distinct colors", () => {
  const HEX = /^#[0-9a-f]{6}$/u;
  const COUNT = 8;

  test("gives the requested number of opaque hex colors, all different", () => {
    const colors = distinctHexColors(COUNT, 0);

    expect(colors).toHaveLength(COUNT);
    expect(colors.every((color) => HEX.test(color))).toBe(true);
    expect(new Set(colors).size).toBe(COUNT);
  });

  test("starts at the given hue", () => {
    expect(distinctHexColors(1, 0)).toStrictEqual(["#d74242"]);
  });
});
