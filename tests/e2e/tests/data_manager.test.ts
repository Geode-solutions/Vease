// Node imports

// Local imports
import {
  assignCrs,
  clickdeleteDataButton,
  confirmDelete,
  confirmRename,
  expandDataManagerPiP,
  expandObjectTree,
  expectCurrentCrs,
  focusRowItem,
  isolateRowItem,
  openCrsByButton,
  openDataManagerPiP,
  openRenameByButton,
  openRenameByName,
  toggleRowVisibility,
} from "@vease_tests/utils/data_manager";
import {
  brepGeodeObjectType,
  pointSetGeodeObjectType,
  polygonalSurfaceGeodeObjectType,
} from "@vease_tests/utils/constants";
import { closeFeedbackSnackbar, moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { navigateToDataManagerPage } from "@vease_tests/utils/navigate";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const BREP_FILE = "test.og_brep";
const POLYGONAL_SURFACE_FILE = "test.og_psf3d";
const POINTSET_FILE = "test.og_pts3d";
const RENAMED_BREP = "cube vease";
const RENAMED_POLYGONAL_SURFACE = "surface vease";
const LAMBERT_93 = "RGF93 v1 / Lambert-93";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

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

test("assign crs via button", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expectCurrentCrs(window, "None (local coordinates)");
  await assignCrs(window, LAMBERT_93);
});

test("current crs is the assigned one", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expectCurrentCrs(window, "EPSG:2154");
  await window.keyboard.press("Escape");
  await moveMouseOutOfTheWay(window);
});

test("toggle visibility off", async ({ window }) => {
  await toggleRowVisibility(window, pointSetGeodeObjectType);
  await moveMouseOutOfTheWay(window);
  await closeFeedbackSnackbar(window);
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
  await waitForActionSettled(window);
  await moveMouseOutOfTheWay(window);
  await closeFeedbackSnackbar(window);
});

test("expand pip", async ({ window }) => {
  await expandDataManagerPiP(window);
});

test("delete object", async ({ window }) => {
  await clickdeleteDataButton(window, RENAMED_POLYGONAL_SURFACE);
});

test("confirm delete object", async ({ window }) => {
  await confirmDelete(window);
});
