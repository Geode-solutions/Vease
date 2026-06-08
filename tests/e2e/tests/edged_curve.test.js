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
const inputFilename = "test.og_edc3d";
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
    y = 210;
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
  await vertexAttribute(window, "meshEdgesMenu");
  await expect(window).toHaveScreenshot();
});

test("edge attribute", async () => {
  await pointsVisibility(window, "mesh", true);
  await applyAttribute(window, "meshEdgesMenu", {
    attributeType: "Edge attribute",
    attributeName: "edges",
  });
  await expect(window).toHaveScreenshot();
});

test("color and opacity", async () => {
  await changeColor(window, "meshEdgesMenu");
  await expect(window).toHaveScreenshot();
  await changeOpacity(window, "meshEdgesMenu", 50);
  await expect(window).toHaveScreenshot();
  await changeOpacity(window, "meshEdgesMenu", 100);
});
