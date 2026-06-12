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
  pointsVisibility,
  polyhedraAttribute,
  vertexAttribute,
  viewerContextMenu,
  featureVisibility,
  featureSizeOrWidth,
  featureTextures,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_hso3d";
const attributeName = "test_attribute";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const geodeObjectType = "HybridSolid3D";

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
  await vertexAttribute(window, "meshPolyhedraMenu");
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await polyhedraAttribute(window, "meshPolyhedraMenu", attributeName);
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

test("points size", async () => {
  await featureSizeOrWidth(window, "mesh", "Points", 15);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await featureSizeOrWidth(window, "mesh", "Edges", 5);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await featureVisibility(window, "mesh", "Edges", false);
  await expect(window).toHaveScreenshot();
  await featureVisibility(window, "mesh", "Edges", true); // revert
});

test("polygons visibility", async () => {
  await featureVisibility(window, "mesh", "Polygons", false);
  await expect(window).toHaveScreenshot();
  await featureVisibility(window, "mesh", "Polygons", true); // revert
});

test("polygons textures", async () => {
  await featureTextures(window, "mesh", "Polygons");
  await expect(window).toHaveScreenshot();
});

test("polyhedra visibility", async () => {
  await featureVisibility(window, "mesh", "Polyhedra", false);
  await expect(window).toHaveScreenshot();
  await featureVisibility(window, "mesh", "Polyhedra", true); // revert
});
