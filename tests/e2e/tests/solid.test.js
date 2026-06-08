// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  loadData,
  navigateToApp,
pointsMenuClick,
  setPointsSize,
  setPointsVisibility,
  vertexAttribute,
  viewerContextMenu,
  openFeatureMenu,
  setFeatureVisibility,
  setFeatureSizeOrWidth,
  setFeatureColorRandom,
} from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_hso3d";
const viewerObjectType = "mesh";
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
  await window.mouse.click(0, 0); // close context menu
});

test("points visibility", async () => {
  const visibility = true;
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  const size = 15;
  await setPointsSize(window, viewerObjectType, size);
  await expect(window).toHaveScreenshot();
  });
  test("vertex attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await vertexAttribute(window, "meshPolyhedraMenu");

test("points color", async () => {
  await openFeatureMenu(window, viewerObjectType, "Points");
  await setFeatureVisibility(window, viewerObjectType, "Points", true);
  await setFeatureColorRandom(window);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Points");
  await window.waitForTimeout(afterActionWait);
});

test("edges width", async () => {
  await openFeatureMenu(window, viewerObjectType, "Edges");
  await setFeatureVisibility(window, viewerObjectType, "Edges", true);
  await setFeatureSizeOrWidth(window, viewerObjectType, "Edges", 5);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Edges");
  await window.waitForTimeout(afterActionWait);
});

test("edges color", async () => {
  await openFeatureMenu(window, viewerObjectType, "Edges");
  await setFeatureVisibility(window, viewerObjectType, "Edges", true);
  await setFeatureColorRandom(window);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Edges");
  await window.waitForTimeout(afterActionWait);
});

test("polygons visibility", async () => {
  await openFeatureMenu(window, viewerObjectType, "Polygons");
  await setFeatureVisibility(window, viewerObjectType, "Polygons", false);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Polygons");
  await window.waitForTimeout(afterActionWait);
});

test("polygons color", async () => {
  await openFeatureMenu(window, viewerObjectType, "Polygons");
  await setFeatureVisibility(window, viewerObjectType, "Polygons", true);
  await setFeatureColorRandom(window);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Polygons");
  await window.waitForTimeout(afterActionWait);
});

test("polygons textures", async () => {
  await openFeatureMenu(window, viewerObjectType, "Polygons");
  await setFeatureVisibility(window, viewerObjectType, "Polygons", true);
  const select = await window.getByLabel('Select a coloring style');
  await select.click();
  await window.getByRole('option', { name: 'Textures' }).click();
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Polygons");
  await window.waitForTimeout(afterActionWait);
});

test("polyhedra visibility", async () => {
  await openFeatureMenu(window, viewerObjectType, "Polyhedra");
  await setFeatureVisibility(window, viewerObjectType, "Polyhedra", false);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Polyhedra");
  await window.waitForTimeout(afterActionWait);
});

test("polyhedra color", async () => {
  await openFeatureMenu(window, viewerObjectType, "Polyhedra");
  await setFeatureVisibility(window, viewerObjectType, "Polyhedra", true);
  await setFeatureColorRandom(window);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Polyhedra");
  await window.waitForTimeout(afterActionWait);
});
