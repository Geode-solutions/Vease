// Node imports

// Third party imports

// Local imports
import {
  removeClippingPlanes,
  resetClippingPlanes,
  toggleClippingPlanes,
} from "#ogw_e2e/clipping_planes_interaction.js";
import { resetCamera, toggleGridScale } from "#ogw_e2e/camera_interaction.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const brepFilename = "test.og_brep";
const rgd3dFilename = "grid.og_rgd3d";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await resetCamera(window);
});

test("grid scale fits the clipped data", async ({ window }) => {
  await toggleClippingPlanes(window);
  await toggleGridScale(window);
  await moveMouseOutOfTheWay(window);
});

test("grid scale refits after clipping removal", async ({ window }) => {
  await toggleClippingPlanes(window);
  await removeClippingPlanes(window);
  await moveMouseOutOfTheWay(window);
});

test("grid scale fits data imported with an active clipping", async ({ window }) => {
  await resetClippingPlanes(window);
  await loadVeaseTestDatas(window, [rgd3dFilename]);
  await resetCamera(window);
});
