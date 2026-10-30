import { curveEdges, singlePolygon } from "@vease/utils/create_geometry";
import { describe, expect, test, vi } from "vitest";

vi.setConfig({ testTimeout: 10_000 });

describe("create geometry helpers", () => {
  test("links consecutive points of an open curve", () => {
    expect(curveEdges(3, false)).toStrictEqual([
      [0, 1],
      [1, 2],
    ]);
  });

  test("adds the closing edge of a closed curve", () => {
    expect(curveEdges(3, true)).toStrictEqual([
      [0, 1],
      [1, 2],
      [2, 0],
    ]);
  });

  test("gives no edge to a single point", () => {
    expect(curveEdges(1, true)).toStrictEqual([]);
  });

  test("builds one polygon through all the points", () => {
    expect(singlePolygon(4)).toStrictEqual([[0, 1, 2, 3]]);
  });
});
