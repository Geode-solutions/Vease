// Third party imports
import { describe, expect, test, vi } from "vitest";

// Local imports
import { distinctHexColors } from "@vease_server/mcp/utils/distinct_colors";

vi.setConfig({ testTimeout: 10_000 });

const HEX = /^#[0-9a-f]{6}$/u;
const COUNT = 8;
const MANY = 50;
const START_HUE = 0.3;

describe("the distinct colors", () => {
  test("gives the requested number of opaque hex colors, all different", () => {
    const colors = distinctHexColors(COUNT, 0);

    expect(colors).toHaveLength(COUNT);
    expect(colors.every((color) => HEX.test(color))).toBe(true);
    expect(new Set(colors).size).toBe(COUNT);
  });

  test("starts at the given hue", () => {
    expect(distinctHexColors(1, 0)).toStrictEqual(["#d74242"]);
  });

  test("gives the same colors for the same start hue", () => {
    expect(distinctHexColors(COUNT, START_HUE)).toStrictEqual(distinctHexColors(COUNT, START_HUE));
  });

  test("keeps many colors different", () => {
    expect(new Set(distinctHexColors(MANY, START_HUE)).size).toBe(MANY);
  });

  test("draws a random start hue by default", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(distinctHexColors(2)).toStrictEqual(distinctHexColors(2, 0));

    vi.restoreAllMocks();
  });

  test("gives no color for no data", () => {
    expect(distinctHexColors(0)).toStrictEqual([]);
  });
});
