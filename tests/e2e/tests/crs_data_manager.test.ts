// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { LAMBERT_93, POINTSET_FILE } from "#ogw_e2e/crs_test_data.js";
import { confirmAssign, selectCrs, startAlignment } from "#ogw_e2e/crs.js";
import { expectDataRows, expectRowCrs, openCrsByButton } from "@vease_tests/utils/crs";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import { navigateToDataManagerPage } from "@vease_tests/utils/navigate";
import { pointSetGeodeObjectType } from "#ogw_e2e/constants.js";
import { test } from "@vease_tests/utils/fixtures";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load a point set", async ({ window }) => {
  await loadVeaseTestDatas(window, [POINTSET_FILE]);
  await navigateToDataManagerPage(window);
  await expectDataRows(window, [pointSetGeodeObjectType]);
  await moveMouseOutOfTheWay(window);
});

// The data manager page mounts the shared crs dialog of OpenGeodeWeb-Front
test("the crs cell opens the shared crs dialog", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expect(window.getByTestId("crsCurrentValue")).toBeVisible();
});

test("assign a crs from the data manager", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
  await confirmAssign(window);
  await moveMouseOutOfTheWay(window);
});

test("the crs column shows the assigned crs", async ({ window }) => {
  await expectRowCrs(window, pointSetGeodeObjectType, "2154");
});

// Georeference leaves the data manager: the align panel floats over the viewer
test("georeference from the data manager opens the panel in the viewer", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await startAlignment(window);
  await expect(window.getByTestId("crsAlignPanel")).toBeVisible();
});
