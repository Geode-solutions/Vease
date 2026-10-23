// Node imports

// Local imports
import { brepGeodeObjectType, pointSetGeodeObjectType } from "@vease_tests/utils/constants";
import {
  confirmAssign,
  expectCurrentCrs,
  expectRowCrs,
  openCrsByButton,
  openCrsFromFeedback,
  selectCrs,
} from "@vease_tests/utils/crs";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { navigateToDataManagerPage } from "@vease_tests/utils/navigate";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const LAMBERT_93 = "RGF93 v1 / Lambert-93";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load a model", async ({ window }) => {
  await loadVeaseTestDatas(window, ["test.og_brep"]);
});

test("assign a crs to the model", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, brepGeodeObjectType);
  await selectCrs(window, LAMBERT_93);
  await confirmAssign(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
});

test("import data without crs", async ({ window }) => {
  await loadVeaseTestDatas(window, ["test.og_pts3d"]);
  await moveMouseOutOfTheWay(window);
});

test("open the crs dialog from the warning", async ({ window }) => {
  await openCrsFromFeedback(window, "No CRS, project is in EPSG:2154");
  await expectCurrentCrs(window, "None (local coordinates)");
});

test("select the project crs", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
});

test("assign the project crs to the data", async ({ window }) => {
  await confirmAssign(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, pointSetGeodeObjectType, "EPSG:2154");
});
