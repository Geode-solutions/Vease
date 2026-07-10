// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsTextures,
  setPolygonsVisibility,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  defaultDataName,
  meshViewerObjectType,
  triangulatedSurfaceGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import { setMeshPolygonsColor, setMeshPolygonsOpacity } from "@tests/utils/mesh/polygon/color.js";
import {
  setMeshPolygonsVertexAttribute,
  setMeshTriangulatedSurfacePolygonAttribute,
} from "@tests/utils/mesh/polygon/attribute.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setMeshEdgesColor } from "@tests/utils/mesh/edges/color.js";
import { setMeshPointsColor } from "@tests/utils/mesh/points/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_tsf3d";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;

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
  await highlightData(window, triangulatedSurfaceGeodeObjectType, defaultDataName);
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
  await setPointsVisibility(window, meshViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshPolygonsVertexAttribute(window);
  await expect(window).toHaveScreenshot();
});

test("polygon attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshTriangulatedSurfacePolygonAttribute(window);
  await expect(window).toHaveScreenshot();
});

test("polygons color", async () => {
  await setMeshPolygonsColor(window);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setMeshPointsColor(window);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setMeshEdgesColor(window);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setMeshPolygonsOpacity(window, OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, meshViewerObjectType, POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await setEdgesWidth(window, meshViewerObjectType, EDGES_WIDTH);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  await setEdgesVisibility(window, meshViewerObjectType, true);
});

test("polygons visibility", async () => {
  await setPolygonsVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  await setPolygonsVisibility(window, meshViewerObjectType, true);
});

test("polygons textures", async () => {
  await setPolygonsTextures(window, meshViewerObjectType);
  await expect(window).toHaveScreenshot();
});
