// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  changeColor,
  changeOpacity,
  highlightData,
  loadData,
  navigateToApp,
  setCellAttribute,
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setVertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_rgd2d";
const attributeName = "RGB_data";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "RegularGrid2D";

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
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, "mesh", false);
  await setVertexAttribute(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
});

test("cell attribute", async () => {
  await setPointsVisibility(window, "mesh", false);
  await setCellAttribute(window, "meshCellsMenu", attributeName);
  await expect(window).toHaveScreenshot();
});

test("color", async () => {
  await changeColor(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await changeOpacity(window, "meshCellsMenu", OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, "mesh", POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await setEdgesWidth(window, "mesh", EDGES_WIDTH);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, "mesh", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setEdgesVisibility(window, "mesh", true);
});

test("cells visibility", async () => {
  await setCellsVisibility(window, "mesh", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setCellsVisibility(window, "mesh", true);
});
