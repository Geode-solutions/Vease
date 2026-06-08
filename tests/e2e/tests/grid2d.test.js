// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  applyAttribute,
  beforeAllTimeout,
  changeColor,
  changeOpacity,
  loadData,
  navigateToApp,
  pointsVisibility,
  vertexAttribute,
  viewerContextMenu,
} from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_rgd2d";
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
  await vertexAttribute(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
});

test("cell attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await applyAttribute(window, "meshCellsMenu", {
    attributeType: "Cell attribute",
    attributeName: "RGB_data",
  });
  await expect(window).toHaveScreenshot();
});

test("color and opacity", async () => {
  await changeColor(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
  await changeOpacity(window, "meshCellsMenu", 50);
  await expect(window).toHaveScreenshot();
  await changeOpacity(window, "meshCellsMenu", 100);
});
