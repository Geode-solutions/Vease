// Node imports

// Local imports
import {
  applyAlignment,
  confirmAssign,
  confirmConvert,
  confirmProjectCrs,
  expectCrsMismatch,
  expectCurrentCrs,
  expectDataRows,
  expectRowCrs,
  fillAlignPoints,
  openCrsByButton,
  openCrsFromInfoCard,
  openCrsFromTree,
  openProjectCrs,
  selectAlignMode,
  selectAlignmentCrs,
  selectConvertMode,
  selectCrs,
  selectScope,
  startAlignment,
} from "@vease_tests/utils/crs";
import {
  brepGeodeObjectType,
  edgedCurveGeodeObjectType,
  pointSetGeodeObjectType,
} from "@vease_tests/utils/constants";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const BREP_FILE = "test.og_brep";
const POINTSET_FILE = "test.og_pts3d";
// Wells-like data sharing the local frame of the model: aligned with it
const CURVE_FILE = "test.og_edc3d";
const POINTSET_NAME = "test";
const BREP_NAME = "test";
const LAMBERT_93 = "RGF93 v1 / Lambert-93";
const UTM_31N = "WGS 84 / UTM zone 31N";
const ALIGN_SOURCE = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];
const ALIGN_TARGET = [
  { x: 700_000, y: 6_600_000 },
  { x: 700_010, y: 6_600_000 },
  { x: 700_000, y: 6_600_010 },
];

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
  await fillAlignPoints(window, "crsAlignSource", ALIGN_SOURCE);
  await fillAlignPoints(window, "crsAlignTarget", ALIGN_TARGET);
  await selectAlignmentCrs(window, LAMBERT_93);
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
  await fillAlignPoints(window, "crsAlignSource", ALIGN_SOURCE.slice(0, 2));
  await fillAlignPoints(window, "crsAlignTarget", ALIGN_TARGET.slice(0, 2));
  await selectAlignmentCrs(window, LAMBERT_93);
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
  await window.keyboard.press("Escape");
  await moveMouseOutOfTheWay(window);
});

test("open the crs dialog from the info card", async ({ window }) => {
  await openCrsFromInfoCard(window, pointSetGeodeObjectType, POINTSET_NAME);
  await expectCurrentCrs(window, "EPSG:32631");
});

test("close the crs dialog opened from the info card", async ({ window }) => {
  await window.keyboard.press("Escape");
  await moveMouseOutOfTheWay(window);
});

test("convert the model alone", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, brepGeodeObjectType);
  await selectConvertMode(window);
  await selectScope(window, "one");
  await selectCrs(window, LAMBERT_93);
  await confirmConvert(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
  await expectRowCrs(window, edgedCurveGeodeObjectType, "EPSG:32631");
});

test("the model out of the project crs is flagged in the tree", async ({ window }) => {
  await navigateToViewerPage(window);
  await expectCrsMismatch(window, brepGeodeObjectType, BREP_NAME, true);
  await moveMouseOutOfTheWay(window);
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
  await expectRowCrs(window, pointSetGeodeObjectType, "EPSG:2154");
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
  await expectRowCrs(window, edgedCurveGeodeObjectType, "EPSG:2154");
  await moveMouseOutOfTheWay(window);
});
