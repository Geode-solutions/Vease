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
const inputFilename = "test.og_rgd2d";
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
  await setPointsVisibility(window, "mesh", false);
  await vertexAttribute(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
  await window.getByTestId("meshCellsMenu").click();
  await window.waitForTimeout(afterActionWait);
});

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

test("cells visibility", async () => {
  await openFeatureMenu(window, viewerObjectType, "Cells");
  await setFeatureVisibility(window, viewerObjectType, "Cells", false);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Cells");
  await window.waitForTimeout(afterActionWait);
});

test("cells color", async () => {
  await openFeatureMenu(window, viewerObjectType, "Cells");
  await setFeatureVisibility(window, viewerObjectType, "Cells", true);
  await setFeatureColorRandom(window);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Cells");
  await window.waitForTimeout(afterActionWait);
});

