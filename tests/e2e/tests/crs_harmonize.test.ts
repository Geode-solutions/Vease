// Node imports

// Local imports
import { brepGeodeObjectType, pointSetGeodeObjectType } from "#ogw_e2e/constants.js";
import {
  clickAssign,
  confirmAssign,
  expectCrsMismatch,
  expectCurrentCrs,
  expectFeedback,
  expectRowCrs,
  openCrsByButton,
  openCrsFromWarning,
  selectCrs,
} from "@vease_tests/utils/crs";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/viewer_interaction.js";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const LAMBERT_93 = "RGF93 v1 / Lambert-93";
// Around Paris in Lambert-93 metres, without crs
const LAMBERT_FILE = "test_lambert93_no_crs.og_pts3d";
const LAMBERT_NAME = "test_lambert93_no_crs";
// The same points, saved in UTM 31N
const UTM_FILE = "test_utm31n.og_pts3d";
const UTM_NAME = "test_utm31n";
// Local coordinates: they fit no CRS
const LOCAL_FILE = "test.og_pts3d";
const LOCAL_NAME = "test";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load a model", async ({ window }) => {
  await loadVeaseTestDatas(window, ["test.og_brep"]);
});

// The first crs sets the project crs
test("assign a crs to the model", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, brepGeodeObjectType);
  await selectCrs(window, LAMBERT_93);
  await confirmAssign(window);
  await moveMouseOutOfTheWay(window);
  await expectRowCrs(window, brepGeodeObjectType, "EPSG:2154");
});

// Even when their coordinates fit the project crs: only the user knows the crs of the data
test("imported data without crs stay without crs, with a warning", async ({ window }) => {
  await expectFeedback(window, `No CRS, project in EPSG:2154: ${LAMBERT_NAME}`, async () => {
    await loadVeaseTestDatas(window, [LAMBERT_FILE]);
  });
  await navigateToDataManagerPage(window);
  await expectRowCrs(window, LAMBERT_NAME, "None");
  await moveMouseOutOfTheWay(window);
});

test("imported data in another crs are converted to the project crs", async ({ window }) => {
  await expectFeedback(window, `Converted to EPSG:2154: ${UTM_NAME}`, async () => {
    await loadVeaseTestDatas(window, [UTM_FILE]);
  });
  await navigateToDataManagerPage(window);
  await expectRowCrs(window, UTM_NAME, "EPSG:2154");
  await moveMouseOutOfTheWay(window);
});

test("imported data that fit no crs are flagged in the tree", async ({ window }) => {
  await expectFeedback(window, `No CRS, project in EPSG:2154: ${LOCAL_NAME}`, async () => {
    await loadVeaseTestDatas(window, [LOCAL_FILE]);
  });
  await navigateToViewerPage(window);
  await expectCrsMismatch(window, pointSetGeodeObjectType, LOCAL_NAME, true);
  await moveMouseOutOfTheWay(window);
});

test("open the crs dialog from the warning", async ({ window }) => {
  await openCrsFromWarning(window, pointSetGeodeObjectType, LOCAL_NAME);
  await expectCurrentCrs(window, "None (local coordinates)");
});

test("select the project crs", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
});

// An explicit choice: assigned anyway, with the warning offering to georeference
test("assign the project crs to the data", async ({ window }) => {
  await expectFeedback(window, "Georeference the data?", async () => {
    await clickAssign(window);
  });
  await expectCrsMismatch(window, pointSetGeodeObjectType, LOCAL_NAME, false);
  await moveMouseOutOfTheWay(window);
});
