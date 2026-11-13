// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  tetrahedralSolidGeodeObjectType,
  triangulatedSurfaceGeodeObjectType,
} from "@vease_tests/utils/constants";
import { expandMainObjectTree } from "@vease_tests/utils/object_trees/main_object_tree";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
// This VTU file holds one triangle and one tetrahedron: each content becomes its own data
const MIXED_CONTENT_FILE = "mixed_polygons_polyhedra.vtu";
const MIXED_CONTENT_NAME = "mixed_polygons_polyhedra";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load every content of a multi-content file", async ({ window }) => {
  await loadVeaseTestDatas(window, [MIXED_CONTENT_FILE]);
  await expandMainObjectTree(window);
  const treeRows = window.getByTestId("mainObjectTree").getByTestId("treeRowWrapper");
  await expect(
    treeRows.filter({ hasText: triangulatedSurfaceGeodeObjectType }).first(),
  ).toBeVisible();
  await expect(treeRows.filter({ hasText: tetrahedralSolidGeodeObjectType }).first()).toBeVisible();
  // One data per content, both named after the file
  await expect(treeRows.filter({ hasText: MIXED_CONTENT_NAME }).nth(1)).toBeVisible();
});
