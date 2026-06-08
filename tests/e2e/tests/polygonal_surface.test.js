// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  highlightData,
  loadData,
  navigateToApp,
  pointsVisibility,
  polygonAttribute,
  vertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_psf3d";
const attributeName = "test_attribute";
let window = undefined;
let cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup?.();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549,
    y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("points visibility", async () => {
  const viewerObjectType = "mesh",
    visibility = true;
  await pointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await vertexAttribute(window, "meshPolygonsMenu");
  await expect(window).toHaveScreenshot();
});

test("polygon attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await polygonAttribute(window, "meshPolygonsMenu", attributeName);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, "PolygonalSurface3D");
  await expect(window).toHaveScreenshot();
});
