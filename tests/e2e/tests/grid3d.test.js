// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  cellAttribute,
  changeColor,
  changeOpacity,
  loadData,
  navigateToApp,
  pointsVisibility,
  vertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_rgd3d";
const attributeName = "int_attribute";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;

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
  await highlightData(window, "RegularGrid3D");
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
  await vertexAttribute(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
});

test("cell attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await cellAttribute(window, "meshCellsMenu", attributeName);
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
