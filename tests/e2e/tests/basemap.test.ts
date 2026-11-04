// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { confirmAssign, openCrsByButton, selectCrs } from "@vease_tests/utils/crs";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import {
  removeExplodeFilter,
  resetCamera,
  resetExplodeFilter,
  setExplodeFactor,
  toggleExplodeFilter,
  toggleGridScale,
} from "@vease_tests/utils/camera_interaction";
import {
  setBasemapOpacity,
  toggleBasemap,
  toggleBasemapCrop,
  zoomAndRest,
} from "@vease_tests/utils/basemap";
import { brepGeodeObjectType } from "@vease_tests/utils/constants";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/viewer_interaction";
import { test } from "@vease_tests/utils/fixtures";
import { toggleClippingPlanes } from "@vease_tests/utils/clipping_planes_interaction";

// Constants
const BREP_FILE = "test.og_brep";
const LAMBERT_93 = "RGF93 v1 / Lambert-93";
const EXPLODE_FACTOR = 0.5;
const BASEMAP_OPACITY = 50;
const ZOOM_STEPS = 8;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load a model", async ({ window }) => {
  await loadVeaseTestDatas(window, [BREP_FILE]);
});

test("no basemap without crs", async ({ window }) => {
  await expect(window.getByTestId("basemapButton")).toHaveCount(0);
  await expect(window.getByTestId("basemapAttribution")).toBeHidden();
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

// No action: the basemap shows as soon as the project has a CRS
test("the satellite basemap shows on its own", async ({ window }) => {
  await expect(window.getByTestId("basemapAttribution")).toContainText("EOX");
  await moveMouseOutOfTheWay(window);
});

test("zooming in sharpens the visible area of the map", async ({ window }) => {
  await zoomAndRest(window, ZOOM_STEPS);
});

test("back to the whole model", async ({ window }) => {
  await resetCamera(window);
  await moveMouseOutOfTheWay(window);
});

test("crop to data keeps the map on the model top", async ({ window }) => {
  await toggleBasemapCrop(window);
  await moveMouseOutOfTheWay(window);
});

test("crop to data back off", async ({ window }) => {
  await toggleBasemapCrop(window);
  await moveMouseOutOfTheWay(window);
});

test("grid scale measures the data, not the basemap", async ({ window }) => {
  await toggleGridScale(window);
  await moveMouseOutOfTheWay(window);
});

test("grid scale off", async ({ window }) => {
  await toggleGridScale(window);
  await moveMouseOutOfTheWay(window);
});

test("exploded view keeps the basemap on top", async ({ window }) => {
  await toggleExplodeFilter(window);
  await setExplodeFactor(window, EXPLODE_FACTOR);
  await resetCamera(window);
  await moveMouseOutOfTheWay(window);
});

test("basemap goes back down without explosion", async ({ window }) => {
  await resetExplodeFilter(window);
  await removeExplodeFilter(window);
  await toggleExplodeFilter(window);
  await resetCamera(window);
  await moveMouseOutOfTheWay(window);
});

test("clipping planes cut the basemap", async ({ window }) => {
  await toggleClippingPlanes(window);
  await moveMouseOutOfTheWay(window);
});

test("clipping planes off", async ({ window }) => {
  await toggleClippingPlanes(window);
  await moveMouseOutOfTheWay(window);
});

test("show the routes over the satellite map", async ({ window }) => {
  await toggleBasemap(window, "Routes");
});

test("lower the routes opacity", async ({ window }) => {
  await setBasemapOpacity(window, "Routes", BASEMAP_OPACITY);
  await moveMouseOutOfTheWay(window);
});

test("crop the routes only", async ({ window }) => {
  await toggleBasemapCrop(window, "Routes");
  await moveMouseOutOfTheWay(window);
});

test("hide the satellite map, the routes stay", async ({ window }) => {
  await toggleBasemap(window, "Satellite");
});

test("hide the basemap", async ({ window }) => {
  await toggleBasemap(window);
  await expect(window.getByTestId("basemapAttribution")).toBeHidden();
});
