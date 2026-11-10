// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { expandMainObjectTree } from "@vease_tests/utils/object_trees/main_object_tree";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
// This GOCAD TSurf file holds two named surfaces: each one becomes its own data
const TWO_SURFACES_FILE = "two_surfaces.ts";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load every object of a multi-object file", async ({ window }) => {
  await loadVeaseTestDatas(window, [TWO_SURFACES_FILE]);
  await expandMainObjectTree(window);
  const treeRows = window.getByTestId("mainObjectTree").getByTestId("treeRowWrapper");
  await expect(treeRows.filter({ hasText: "first_surf" }).first()).toBeVisible();
  await expect(treeRows.filter({ hasText: "second_surf" }).first()).toBeVisible();
});
