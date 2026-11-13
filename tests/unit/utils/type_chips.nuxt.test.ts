import { describe, expect, test, vi } from "vitest";
import { typeChips } from "@vease/utils/type_chips";

vi.setConfig({ testTimeout: 10_000 });

describe("the import type chips", () => {
  test("shows a single type alone, whatever the number of files", () => {
    expect(typeChips({ "a.vtu": ["BRep"], "b.vtu": ["BRep"] })).toStrictEqual(["BRep"]);
  });

  test("shows each type of one mixed file without a count", () => {
    expect(
      typeChips({ "mixed.vtu": ["TriangulatedSurface3D", "TetrahedralSolid3D"] }),
    ).toStrictEqual(["TriangulatedSurface3D", "TetrahedralSolid3D"]);
  });

  test("counts the imported items of a type shared by several files", () => {
    expect(
      typeChips({
        "a.vtp": ["TriangulatedSurface3D"],
        "b.vtp": ["TriangulatedSurface3D"],
        "c.vtu": ["TetrahedralSolid3D"],
      }),
    ).toStrictEqual(["TriangulatedSurface3D ×2", "TetrahedralSolid3D"]);
  });
});
