// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  highlightData,
  loadData,
  navigateToApp,
  setColor,
  setEdgesVisibility,
  setEdgesWidth,
  setOpacity,
  setPointsSize,
  setPointsVisibility,
  setPolygonsVisibility,
  setPolyhedraAttribute,
  setPolyhedraVisibility,
  setVertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_hso3d";
const attributeName = "test_attribute";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "HybridSolid3D";
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
  await setPointsVisibility(window, viewerObjectType, true);
  await setVertexAttribute(window, `${viewerObjectType}PolyhedraMenu`);
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await setPointsVisibility(window, viewerObjectType, false);
  await setPolyhedraAttribute(window, viewerObjectType, attributeName);
  await expect(window).toHaveScreenshot();
});

test("polyhedra color", async () => {
  await setColor(window, `${viewerObjectType}PolyhedraMenu`);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setColor(window, `${viewerObjectType}PointsMenu`);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setColor(window, `${viewerObjectType}EdgesMenu`);
  await expect(window).toHaveScreenshot();
});

test("polygons color", async () => {
  await setColor(window, `${viewerObjectType}PolygonsMenu`);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setOpacity(window, `${viewerObjectType}PolyhedraMenu`, OPACITY_50);
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

test("polygons visibility", async () => {
  await setPolygonsVisibility(window, viewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolygonsVisibility(window, viewerObjectType, true);
});

test("polyhedra visibility", async () => {
  await setPolyhedraVisibility(window, viewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolyhedraVisibility(window, viewerObjectType, true);
});
