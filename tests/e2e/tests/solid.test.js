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
const inputFilename = "test.og_hso3d";
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
  await vertexAttribute(window, "meshPolyhedraMenu");
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await applyAttribute(window, "meshPolyhedraMenu", {
    attributeType: "Polyhedron attribute",
    attributeName: "test_attribute",
  });
  await expect(window).toHaveScreenshot();
});

test("color", async () => {
  await changeColor(window, "meshPolyhedraMenu");
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await changeOpacity(window, "meshPolyhedraMenu", OPACITY_50);
  await expect(window).toHaveScreenshot();
});
