// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { afterActionWait, moveMouseOutOfTheWay } from "@tests/utils/viewer_interaction";
import {
  brepGeodeObjectType,
  pointSetGeodeObjectType,
  polygonalSurfaceGeodeObjectType,
} from "@tests/utils/constants";
import {
  clickdeleteDataButton,
  confirmDelete,
  confirmRename,
  expandDataManagerPiP,
  expandObjectTree,
  focusRowItem,
  isolateRowItem,
  openDataManagerPiP,
  openRenameByButton,
  openRenameByName,
  toggleRowVisibility,
} from "@tests/utils/data_manager";
import { navigateToDataManagerPage, resetApp } from "@tests/utils/navigate";
import { loadVeaseTestDatas } from "@tests/utils/load";
import { test } from "@tests/utils/fixtures";

// Constants
const BREP_FILE = "test.og_brep";
const POLYGONAL_SURFACE_FILE = "test.og_psf3d";
const POINTSET_FILE = "test.og_pts3d";
const RENAMED_BREP = "cube vease";
const RENAMED_POLYGONAL_SURFACE = "surface vease";

test.describe.configure({ mode: "serial" });

test.afterAll(async ({ window, mode }) => {
  await resetApp(window, mode);
});

test("load objects", async ({ window }) => {
  await loadVeaseTestDatas(window, [BREP_FILE]);
  await loadVeaseTestDatas(window, [POLYGONAL_SURFACE_FILE]);
});

test("navigate to data manager", async ({ window }) => {
  await navigateToDataManagerPage(window);
});

test("import data from data manager", async ({ window }) => {
  await loadVeaseTestDatas(window, [POINTSET_FILE]);
});

test("rename object by clicking item name", async ({ window }) => {
  await openRenameByName(window, brepGeodeObjectType);
});

test("rename object", async ({ window }) => {
  await confirmRename(window, RENAMED_BREP);
});

test("toggle visibility off", async ({ window }) => {
  await toggleRowVisibility(window, pointSetGeodeObjectType);
  await moveMouseOutOfTheWay(window);
  await expect(window.locator(".v-snackbar")).not.toBeVisible({ timeout: 6000 });
});

test("open picture in picture and expand objects", async ({ window }) => {
  await openDataManagerPiP(window);
  await expandObjectTree(window);
});

test("focus object from pip", async ({ window }) => {
  await focusRowItem(window, RENAMED_BREP);
});

test("rename dialog via button", async ({ window }) => {
  await openRenameByButton(window, polygonalSurfaceGeodeObjectType);
});

test("rename object via button", async ({ window }) => {
  await confirmRename(window, RENAMED_POLYGONAL_SURFACE);
  await moveMouseOutOfTheWay(window);
});

test("isolate object", async ({ window }) => {
  await isolateRowItem(window, pointSetGeodeObjectType);
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
  await expect(window.locator(".v-snackbar")).not.toBeVisible({ timeout: 6000 });
});

test("expand pip", async ({ window }) => {
  await expandDataManagerPiP(window);
  await window.waitForTimeout(afterActionWait);
});

test("delete object", async ({ window }) => {
  await clickdeleteDataButton(window, RENAMED_POLYGONAL_SURFACE);
});

test("confirm delete object", async ({ window }) => {
  await confirmDelete(window);
});
