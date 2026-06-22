// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  highlightData,
  loadData,
  navigateToApp,
  setCellAttribute,
  setCellsColor,
  setCellsOpacity,
  setCellsVisibility,
  setEdgesColor,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsColor,
  setPointsSize,
  setPointsVisibility,
  setVertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_rgd3d";
const attributeName = "int_attribute";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "RegularGrid3D";
const viewerObjectType = "mesh";

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
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
  const visibility = true;
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, viewerObjectType, false);
  await setVertexAttribute(window, `${viewerObjectType}CellsMenu`);
  await expect(window).toHaveScreenshot();
});

test("cell attribute", async () => {
  await setPointsVisibility(window, viewerObjectType, false);
  await setCellAttribute(window, viewerObjectType, attributeName);
  await expect(window).toHaveScreenshot();
});

test("cells color", async () => {
  await setCellsColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setPointsColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setEdgesColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setCellsOpacity(window, viewerObjectType, OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, viewerObjectType, POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await setEdgesWidth(window, viewerObjectType, EDGES_WIDTH);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, viewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setEdgesVisibility(window, viewerObjectType, true);
});

test("cells visibility", async () => {
  await setCellsVisibility(window, viewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setCellsVisibility(window, viewerObjectType, true);
});
