// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { LAMBERT_93, POINTSET_FILE, UTM_31N } from "@vease_tests/utils/crs_test_data";
import { confirmAssign, openCrsByButton, selectCrs } from "@vease_tests/utils/crs";
import { expectCrsChip, toggleFavoriteCrs } from "@vease_tests/utils/crs_shortlist";
import { closeCrsDialog } from "@vease_tests/utils/crs_flows";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { navigateToDataManagerPage } from "@vease_tests/utils/navigate";
import { pointSetGeodeObjectType } from "#ogw_e2e/constants.js";
import { test } from "@vease_tests/utils/fixtures";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load a point set", async ({ window }) => {
  await loadVeaseTestDatas(window, [POINTSET_FILE]);
  await navigateToDataManagerPage(window);
});

test("no chips before any crs is starred or used", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expect(window.getByTestId("crsFavoriteChip")).toHaveCount(0);
  await expect(window.getByTestId("crsRecentChip")).toHaveCount(0);
});

test("a starred crs becomes a favorite chip", async ({ window }) => {
  await toggleFavoriteCrs(window, UTM_31N);
  await expectCrsChip(window, "crsFavoriteChip", "EPSG:32631");
});

test("assign a crs", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
  await confirmAssign(window);
});

test("the favorite and the assigned crs come back as chips", async ({ window }) => {
  await openCrsByButton(window, pointSetGeodeObjectType);
  await expectCrsChip(window, "crsFavoriteChip", "EPSG:32631");
  await expectCrsChip(window, "crsRecentChip", "EPSG:2154");
  await closeCrsDialog(window);
});
