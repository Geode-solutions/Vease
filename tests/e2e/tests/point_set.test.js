// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  changeColor,
  changeOpacity,
  featureSizeOrWidth,
  highlightData,
  loadData,
  navigateToApp,
  pointsVisibility,
  vertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_pts3d";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const geodeObjectType = "PointSet3D";

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
    visibility = false;
  await pointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await pointsVisibility(window, "mesh", true);
  await vertexAttribute(window, "meshPointsMenu");
  await expect(window).toHaveScreenshot();
});

test("color", async () => {
  await changeColor(window, "meshPointsMenu");
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await changeOpacity(window, "meshPointsMenu", OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await featureSizeOrWidth(window, "mesh", "Points", POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});
