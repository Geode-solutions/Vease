// Node imports

// Local imports
import {
  applyAlignment,
  assignCrs,
  convertCrs,
  expectCurrentCrs,
  expectDataRows,
  fillAlignPoints,
  openCrsByButton,
  startAlignment,
} from "@vease_tests/utils/crs";
import { brepGeodeObjectType, pointSetGeodeObjectType } from "@vease_tests/utils/constants";
import { closeFeedbackSnackbar, moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { navigateToDataManagerPage } from "@vease_tests/utils/navigate";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const BREP_FILE = "test.og_brep";
const POINTSET_FILE = "test.og_pts3d";
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

test("convert crs via dialog", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await convertCrs(window, UTM_31N);
});

test("current crs is the converted one", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expectCurrentCrs(window, "EPSG:32631");
  await window.keyboard.press("Escape");
  await moveMouseOutOfTheWay(window);
});

test("align crs from three points", async ({ window }) => {
  await openCrsByButton(window, brepGeodeObjectType);
  await startAlignment(window);
  await fillAlignPoints(window, "crsAlignSource", ALIGN_SOURCE);
  await fillAlignPoints(window, "crsAlignTarget", ALIGN_TARGET);
  await applyAlignment(window, LAMBERT_93);
  await moveMouseOutOfTheWay(window);
  await closeFeedbackSnackbar(window);
});

test("current crs is the aligned one", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, brepGeodeObjectType);
  await expectCurrentCrs(window, "EPSG:2154");
  await window.keyboard.press("Escape");
  await moveMouseOutOfTheWay(window);
});
