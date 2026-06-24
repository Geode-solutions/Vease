// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  expandMainObjectTree,
  highlightData,
  setEdgesColor,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsColor,
  setPointsSize,
  setPointsVisibility,
  setPolygonsColor,
  setPolygonsVisibility,
  setPolyhedraColor,
  setPolyhedraOpacity,
  setPolyhedraPolyhedronAttribute,
  setPolyhedraVertexAttribute,
  setPolyhedraVisibility,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_tso3d";
const attributeName = "tetrahedron_adjacents";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "TetrahedralSolid3D";
const viewerObjectType = "mesh";

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expandMainObjectTree(window);
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
  await setPolyhedraVertexAttribute(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await setPointsVisibility(window, viewerObjectType, false);
  await setPolyhedraPolyhedronAttribute(window, viewerObjectType, attributeName);
  await expect(window).toHaveScreenshot();
});

test("polyhedra color", async () => {
  await setPolyhedraColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setPointsColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setEdgesColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("polygons color", async () => {
  await setPolygonsColor(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setPolyhedraOpacity(window, viewerObjectType, OPACITY_50);
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
