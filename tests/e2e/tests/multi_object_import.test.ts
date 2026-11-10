// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { expandMainObjectTree } from "@vease_tests/utils/object_trees/main_object_tree";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
// This GOCAD TSurf file holds two named surfaces: each one becomes its own data
const TWO_SURFACES_FILE = "two_surfaces.ts";
// Written at runtime: a GOCAD .ts file in the repository would be parsed as TypeScript by the formatter and linters
const TWO_SURFACES_CONTENT = `GOCAD TSurf 1
HEADER {
name:first_surf
}
TFACE
VRTX 1 0 0 0
VRTX 2 1 0 0
VRTX 3 0 1 0
TRGL 1 2 3
END
GOCAD TSurf 1
HEADER {
name:second_surf
}
TFACE
VRTX 1 0 0 1
VRTX 2 1 0 1
VRTX 3 0 1 1
TRGL 1 2 3
END
`;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load every object of a multi-object file", async ({ window }, testInfo) => {
  const inputDataPath = testInfo.outputPath("data");
  fs.mkdirSync(inputDataPath, { recursive: true });
  fs.writeFileSync(path.join(inputDataPath, TWO_SURFACES_FILE), TWO_SURFACES_CONTENT);
  await loadVeaseTestDatas(window, [TWO_SURFACES_FILE], { inputDataPath });
  await expandMainObjectTree(window);
  const treeRows = window.getByTestId("mainObjectTree").getByTestId("treeRowWrapper");
  await expect(treeRows.filter({ hasText: "first_surf" }).first()).toBeVisible();
  await expect(treeRows.filter({ hasText: "second_surf" }).first()).toBeVisible();
});
