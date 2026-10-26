// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { type TileServer, selectBasemapStyle, startTileServer } from "@vease_tests/utils/basemap";
import { confirmAssign, openCrsByButton, selectCrs } from "@vease_tests/utils/crs";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import { brepGeodeObjectType } from "@vease_tests/utils/constants";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const BREP_FILE = "test.og_brep";
const LAMBERT_93 = "RGF93 v1 / Lambert-93";

let tileServer: TileServer | undefined = undefined;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

// Runs before the app is launched (the app fixture is only created by the first test), so the back inherits the env
test.beforeAll(async () => {
  tileServer = await startTileServer();
});

test.afterAll(async () => {
  await tileServer?.stop();
});

test("load a model", async ({ window }) => {
  await loadVeaseTestDatas(window, [BREP_FILE]);
});

test("basemap is disabled without crs", async ({ window }) => {
  await expect(window.getByTestId("basemapButton")).toBeDisabled();
});

test("open the crs dialog", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, brepGeodeObjectType);
});

test("select a crs to assign", async ({ window }) => {
  await selectCrs(window, LAMBERT_93);
});

test("assign the selected crs", async ({ window }) => {
  await confirmAssign(window);
  await navigateToViewerPage(window);
  await moveMouseOutOfTheWay(window);
});

test("show the satellite basemap", async ({ window }) => {
  await selectBasemapStyle(window, "satellite");
  await expect(window.getByTestId("basemapAttribution")).toContainText("Esri");
  await moveMouseOutOfTheWay(window);
});

test("hide the basemap", async ({ window }) => {
  await selectBasemapStyle(window, "none");
  await expect(window.getByTestId("basemapAttribution")).toBeHidden();
  await moveMouseOutOfTheWay(window);
});
