// Node imports

// Third party imports

// Local imports
import {
  afterActionWait,
  moveMouseOutOfTheWay,
} from "@tests/utils/viewer_interaction.js";
import {
  brepGeodeObjectType,
  pointSetGeodeObjectType,
  polygonalSurfaceGeodeObjectType,
} from "@tests/utils/constants.js";
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
} from "@tests/utils/data_manager.js";
import { loadDatas } from "@tests/utils/load.js";
import { navigateToDataManagerPage } from "@tests/utils/navigate.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const BREP_FILE = "test.og_brep";
const POLYGONAL_SURFACE_FILE = "test.og_psf3d";
const POINTSET_FILE = "test.og_pts3d";
const RENAMED_BREP = "cube vease";
const RENAMED_POLYGONAL_SURFACE = "surface vease";

test.describe.configure({ mode: "serial" });

test("load objects", async ({ window }) => {
  await loadDatas(window, [BREP_FILE]);
  await loadDatas(window, [POLYGONAL_SURFACE_FILE]);
});

test("navigate to data manager", async ({ window }) => {
  await navigateToDataManagerPage(window);
});

test("import data from data manager", async ({ window }) => {
  await loadDatas(window, [POINTSET_FILE]);
});

test("rename object by clicking item name", async ({ window }) => {
  await openRenameByName(window, brepGeodeObjectType);
});

test("rename object", async ({ window }) => {
  await confirmRename(window, RENAMED_BREP);
});

test("toggle visibility off", async ({ window }) => {
  await toggleRowVisibility(window, pointSetGeodeObjectType);
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
