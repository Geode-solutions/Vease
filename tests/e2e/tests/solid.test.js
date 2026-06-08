// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  loadData,
  navigateToApp,
  pointsVisibility,
  polyhedraAttribute,
  vertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_inteaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_hso3d";
const attribute_name = "test_attribute";
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
  await vertexAttribute(window, "meshPolyhedraMenu");
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await pointsVisibility(window, "mesh", false);
  await polyhedraAttribute(window, "meshPolyhedraMenu", attribute_name);
  await expect(window).toHaveScreenshot();
});
