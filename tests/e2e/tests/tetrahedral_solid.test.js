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
  setEdgesVisibility,
  setEdgesWidth,
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
const inputFilename = "test.og_tso3d";
const attributeName = "tetrahedron_adjacents";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "TetrahedralSolid3D";

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
  const viewerObjectType = "mesh",
    visibility = true;
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, "mesh", true);
  await setVertexAttribute(window, "meshPolyhedraMenu");
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await setPointsVisibility(window, "mesh", false);
  await setPolyhedraAttribute(window, "mesh", attributeName);
  await expect(window).toHaveScreenshot();
});

test("polyhedra color", async () => {
  await changeColor(window, "meshPolyhedraMenu");
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await changeColor(window, "meshPointsMenu");
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await changeColor(window, "meshEdgesMenu");
  await expect(window).toHaveScreenshot();
});

test("polygons color", async () => {
  await changeColor(window, "meshPolygonsMenu");
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await changeOpacity(window, "meshPolyhedraMenu", OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, "mesh", POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await setEdgesWidth(window, "mesh", EDGES_WIDTH);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, "mesh", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setEdgesVisibility(window, "mesh", true);
});

test("polygons visibility", async () => {
  await setPolygonsVisibility(window, "mesh", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolygonsVisibility(window, "mesh", true);
});

test("polyhedra visibility", async () => {
  await setPolyhedraVisibility(window, "mesh", false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolyhedraVisibility(window, "mesh", true);
});
