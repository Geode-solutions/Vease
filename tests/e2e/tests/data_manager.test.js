// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { afterActionWait, beforeAllTimeout } from "@tests/utils/viewer_interaction.js";
import {
  clickdeleteDataButton,
  confirmDelete,
  confirmRename,
  expandDataManagerPiP,
  expandObjectTree,
  focusRowItem,
  isolateRowItem,
  navigateToDataManager,
  openDataManagerPiP,
  openRenameByButton,
  openRenameByName,
  toggleRowVisibility,
} from "@tests/utils/data_manager.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { test } from "@tests/fixtures.js";

// Constants
const BREP_FILE = "test.og_brep";
const POLYGONAL_SURFACE_FILE = "test.og_psf3d";
const POINTSET_FILE = "test.og_pts3d";
const BREP_TYPE = "BRep";
const POLYGONAL_SURFACE_TYPE = "PolygonalSurface3D";
const POINTSET_TYPE = "PointSet3D";
const RENAMED_BREP = "cube vease";
const RENAMED_POLYGONAL_SURFACE = "surface vease";

let window = undefined;
let cleanup = undefined;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load objects", async () => {
  await loadData(window, BREP_FILE);
  await loadData(window, POLYGONAL_SURFACE_FILE);
  await expect(window).toHaveScreenshot();
});

test("navigate to data manager", async () => {
  await navigateToDataManager(window);
  await expect(window).toHaveScreenshot();
});

test("import data from data manager", async () => {
  await loadData(window, POINTSET_FILE);
  await expect(window).toHaveScreenshot();
});

test("rename object by clicking item name", async () => {
  await openRenameByName(window, BREP_TYPE);
  await expect(window).toHaveScreenshot();
});

test("rename object", async () => {
  await confirmRename(window, RENAMED_BREP);
  await expect(window).toHaveScreenshot();
});

test("toggle visibility off", async () => {
  await toggleRowVisibility(window, POINTSET_TYPE);
  await expect(window).toHaveScreenshot();
});

test("open picture in picture and expand objects", async () => {
  await openDataManagerPiP(window);
  await expandObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("focus object from pip", async () => {
  await focusRowItem(window, RENAMED_BREP);
  await expect(window).toHaveScreenshot();
});

test("rename dialog via button", async () => {
  await openRenameByButton(window, POLYGONAL_SURFACE_TYPE);
  await expect(window).toHaveScreenshot();
});

test("rename object via button", async () => {
  await confirmRename(window, RENAMED_POLYGONAL_SURFACE);
  await expect(window).toHaveScreenshot();
});

test("isolate object", async () => {
  await isolateRowItem(window, POINTSET_TYPE);
  await expect(window).toHaveScreenshot();
});

test("expand pip", async () => {
  await expandDataManagerPiP(window);
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("delete object", async () => {
  await clickdeleteDataButton(window, RENAMED_POLYGONAL_SURFACE);
  await expect(window).toHaveScreenshot();
});

test("confirm delete object", async () => {
  await confirmDelete(window);
  await expect(window).toHaveScreenshot();
});
