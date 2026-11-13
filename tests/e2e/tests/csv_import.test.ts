// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { defaultDataName, pointSetGeodeObjectType } from "#ogw_e2e/constants.js";
import { expandMainObjectTree } from "#ogw_e2e/object_trees/main_object_tree.js";
import { loadVeaseCsvData } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const inputFilename = "test.csv";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load csv file", async ({ window }) => {
  await loadVeaseCsvData(window, inputFilename, { x: "X", y: "Y", z: "Z" });
  await expandMainObjectTree(window);
  const treeRows = window.getByTestId("mainObjectTree").getByTestId("treeRowWrapper");
  await expect(treeRows.filter({ hasText: pointSetGeodeObjectType }).first()).toBeVisible();
  await expect(treeRows.filter({ hasText: defaultDataName }).first()).toBeVisible();
});
