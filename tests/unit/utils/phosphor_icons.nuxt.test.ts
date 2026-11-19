// Node imports
import path from "node:path";

// Third party imports
import { describe, expect, test, vi } from "vitest";

// Local imports
import { missingPhosphorIcons } from "@ogw_tests/phosphor_glyphs";

vi.setConfig({ testTimeout: 10_000 });

const VEASE_ROOT = path.resolve(import.meta.dirname, "..", "..", "..");

describe("phosphor icons", () => {
  test("every icon written in the sources is a Phosphor glyph", () => {
    expect(missingPhosphorIcons(VEASE_ROOT, ["app"])).toStrictEqual([]);
  });
});
