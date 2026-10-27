// Node imports

// Local imports
import {
  applyAlignment,
  confirmAssign,
  confirmConvert,
  expectCurrentCrs,
  expectDataRows,
  expectRowCrs,
  fillAlignPoints,
  openCrsByButton,
  openCrsFromInfoCard,
  openCrsFromTree,
  selectAlignMode,
  selectAlignmentCrs,
  selectConvertMode,
  selectCrs,
  startAlignment,
} from "@vease_tests/utils/crs";
import { brepGeodeObjectType, pointSetGeodeObjectType } from "@vease_tests/utils/constants";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const BREP_FILE = "test.og_brep";
const POINTSET_FILE = "test.og_pts3d";
const POINTSET_NAME = "test";
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

test("convert to the selected crs", async ({ window }) => {
  await confirmConvert(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, pointSetGeodeObjectType, "EPSG:32631");
});

test("open the alignment drawer", async ({ window }) => {
  await openCrsByButton(window, brepGeodeObjectType);
  await startAlignment(window);
});

test("fill the affine alignment points and target crs", async ({ window }) => {
  await selectAlignMode(window, "affine");
  await fillAlignPoints(window, "crsAlignSource", ALIGN_SOURCE);
  await fillAlignPoints(window, "crsAlignTarget", ALIGN_TARGET);
  await selectAlignmentCrs(window, LAMBERT_93);
});

test("apply the alignment", async ({ window }) => {
  await applyAlignment(window);
  await moveMouseOutOfTheWay(window);
});

test("current crs is the aligned one", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
  await moveMouseOutOfTheWay(window);
});

test("re-align without distortion with two pairs", async ({ window }) => {
  await openCrsByButton(window, brepGeodeObjectType);
  await startAlignment(window);
  await fillAlignPoints(window, "crsAlignSource", ALIGN_SOURCE.slice(0, 2));
  await fillAlignPoints(window, "crsAlignTarget", ALIGN_TARGET.slice(0, 2));
  await selectAlignmentCrs(window, LAMBERT_93);
  await applyAlignment(window);
  // The alignment drawer lives in the viewer: the data table is on the data manager page
  await navigateToDataManagerPage(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
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
