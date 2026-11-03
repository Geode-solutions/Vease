// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  ALIGN_SOURCE,
  ALIGN_TARGET,
  BREP_FILE,
  BREP_NAME,
  CC42,
  CURVE_FILE,
  LAMBERT_93,
  POINTSET_FILE,
  POINTSET_NAME,
  UTM_31N,
} from "@vease_tests/utils/crs_test_data";
import {
  applyAlignment,
  confirmAssign,
  confirmConvert,
  confirmProjectCrs,
  expectCrsMismatch,
  expectCurrentCrs,
  expectDataRows,
  expectRowCrs,
  openCrsByButton,
  openCrsFromInfoCard,
  openCrsFromTree,
  openCrsFromWarning,
  openProjectCrs,
  selectAlignMode,
  selectConvertMode,
  selectCrs,
  startAlignment,
} from "@vease_tests/utils/crs";
import {
  assignAnywayToAll,
  closeCrsDialog,
  convertAloneTo,
  expectEveryRowCrs,
  fillAlignment,
  startMisfitAssign,
} from "@vease_tests/utils/crs_flows";
import {
  brepGeodeObjectType,
  edgedCurveGeodeObjectType,
  pointSetGeodeObjectType,
} from "@vease_tests/utils/constants";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load objects", async ({ window }) => {
  await loadVeaseTestDatas(window, [BREP_FILE]);
  await loadVeaseTestDatas(window, [POINTSET_FILE]);
});

test("navigate to data manager", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await expectDataRows(window, [brepGeodeObjectType, pointSetGeodeObjectType]);
  await moveMouseOutOfTheWay(window);
});

test("open the crs dialog from the table", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expectCurrentCrs(window, "None (local coordinates)");
});

test("select a crs to assign", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
});

test("assign the selected crs", async ({ window }) => {
  // "This data only" by default: the point set alone, the project follows it
  await confirmAssign(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, pointSetGeodeObjectType, "EPSG:2154");
});

test("current crs is the assigned one", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expectCurrentCrs(window, "EPSG:2154");
});

test("open the convert mode", async ({ window }) => {
  await selectConvertMode(window);
});

test("select a crs to convert to", async ({ window }) => {
  await selectCrs(window, UTM_31N);
});

// "All data" by default: the project moves to UTM; the local model does not fit it and stays
test("convert to the selected crs", async ({ window }) => {
  await confirmConvert(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, pointSetGeodeObjectType, "EPSG:32631");
});

test("load a curve sharing the model frame", async ({ window }) => {
  await loadVeaseTestDatas(window, [CURVE_FILE]);
  await navigateToDataManagerPage(window);
  await moveMouseOutOfTheWay(window);
});

test("open the alignment drawer", async ({ window }) => {
  await openCrsByButton(window, brepGeodeObjectType);
  await startAlignment(window);
});

test("fill the affine alignment points and target crs", async ({ window }) => {
  await selectAlignMode(window, "affine");
  // "All data" by default: the curve shares the model frame
  await fillAlignment(window, ALIGN_SOURCE, ALIGN_TARGET, LAMBERT_93);
});

test("apply the alignment", async ({ window }) => {
  await applyAlignment(window);
  await moveMouseOutOfTheWay(window);
});

// Typed in Lambert-93, then converted to the project crs (UTM)
test("current crs is the project one", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:32631");
  // Aligned in the same request as the model
  await expectRowCrs(window, edgedCurveGeodeObjectType, "EPSG:32631");
  await moveMouseOutOfTheWay(window);
});

test("re-align without distortion with two pairs", async ({ window }) => {
  await openCrsByButton(window, brepGeodeObjectType);
  await startAlignment(window);
  // The model has a crs: "This data only" by default, the other data stay
  await fillAlignment(window, ALIGN_SOURCE.slice(0, 2), ALIGN_TARGET.slice(0, 2), LAMBERT_93);
  await applyAlignment(window);
  // The alignment drawer lives in the viewer: the data table is on the data manager page
  await navigateToDataManagerPage(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:32631");
  await moveMouseOutOfTheWay(window);
});

test("no data is flagged once every data follows the project", async ({ window }) => {
  await navigateToViewerPage(window);
  await expectCrsMismatch(window, brepGeodeObjectType, BREP_NAME, false);
  await expectCrsMismatch(window, pointSetGeodeObjectType, POINTSET_NAME, false);
  await moveMouseOutOfTheWay(window);
});

test("open the crs dialog from the object tree", async ({ window }) => {
  await navigateToViewerPage(window);
  await openCrsFromTree(window, pointSetGeodeObjectType, POINTSET_NAME);
  await expectCurrentCrs(window, "EPSG:32631");
});

test("close the crs dialog opened from the object tree", async ({ window }) => {
  await closeCrsDialog(window);
});

test("open the crs dialog from the info card", async ({ window }) => {
  await openCrsFromInfoCard(window, pointSetGeodeObjectType, POINTSET_NAME);
  await expectCurrentCrs(window, "EPSG:32631");
});

test("close the crs dialog opened from the info card", async ({ window }) => {
  await closeCrsDialog(window);
});

test("convert the model alone", async ({ window }) => {
  await convertAloneTo(window, brepGeodeObjectType, LAMBERT_93);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
  await expectRowCrs(window, edgedCurveGeodeObjectType, "EPSG:32631");
});

test("the model out of the project crs is flagged in the tree", async ({ window }) => {
  await navigateToViewerPage(window);
  await expectCrsMismatch(window, brepGeodeObjectType, BREP_NAME, true);
  await moveMouseOutOfTheWay(window);
});

test("the warning opens the crs dialog of the model", async ({ window }) => {
  await openCrsFromWarning(window, brepGeodeObjectType, BREP_NAME);
  await expectCurrentCrs(window, "EPSG:2154");
  await closeCrsDialog(window);
});

test("open the project crs from the scene", async ({ window }) => {
  await navigateToViewerPage(window);
  await openProjectCrs(window);
});

// The model is in Lambert-93, the others in UTM 31N: a Lambert-93 project moves the others
test("change the project crs", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
  await confirmProjectCrs(window);
  await moveMouseOutOfTheWay(window);
  await expectCrsMismatch(window, pointSetGeodeObjectType, POINTSET_NAME, false);
});

test("every data is in the project crs", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await expectEveryRowCrs(window, "EPSG:2154");
  await moveMouseOutOfTheWay(window);
});

// Every data is in Lambert-93. Their coordinates are local numbers: they do not fit CC42
test("relabeling a georeferenced data with a misfit crs asks first", async ({ window }) => {
  await startMisfitAssign(window, brepGeodeObjectType, CC42);
  await expect(window.getByTestId("crsAssignMismatch")).toContainText("Did you mean Convert?");
});

test("convert instead switches to convert", async ({ window }) => {
  await window.getByTestId("crsConvertInstead").click();
  await waitForActionSettled(window);
  await expect(window.getByTestId("crsConvertButton")).toBeVisible();
});

test("assign anyway to all data", async ({ window }) => {
  await assignAnywayToAll(window, CC42);
  // Every data was in Lambert-93: all relabeled together
  await expectEveryRowCrs(window, "EPSG:3942");
});
