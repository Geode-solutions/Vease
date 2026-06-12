// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  changeColor,
  changeOpacity,
  featureSizeOrWidth,
  featureTextures,
  featureVisibility,
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
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "PolygonalSurface3D";

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

test("highlight", async () => {
  await highlightData(window, geodeObjectType);
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

test("color", async () => {
  await changeColor(window, "meshPolygonsMenu");
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await changeOpacity(window, "meshPolygonsMenu", OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await featureSizeOrWidth(window, "mesh", "Points", POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await featureSizeOrWidth(window, "mesh", "Edges", EDGES_WIDTH);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await featureVisibility(window, "mesh", "Edges", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await featureVisibility(window, "mesh", "Edges", true);
});

test("polygons visibility", async () => {
  await featureVisibility(window, "mesh", "Polygons", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await featureVisibility(window, "mesh", "Polygons", true);
});

test("polygons textures", async () => {
  await featureTextures(window, "mesh", "Polygons");
  await expect(window).toHaveScreenshot();
});
