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
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  defaultDataName,
  edgedCurveAttributeName,
  edgedCurveGeodeObjectType,
  meshViewerObjectType,
} from "@tests/utils/constants.js";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import { setMeshEdgesColorWithSlider, setMeshEdgesOpacity } from "@tests/utils/mesh/edges/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setMeshEdgesEdgeAttribute } from "@tests/utils/mesh/edges/attribute.js";
import { setMeshPointsColorWithSlider } from "@tests/utils/mesh/points/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_edc3d";
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
  await highlightData(window, edgedCurveGeodeObjectType, defaultDataName);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549,
    y = 210;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("points visibility", async () => {
  const visibility = false;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("edge attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshEdgesEdgeAttribute(window, meshViewerObjectType, edgedCurveAttributeName);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setMeshEdgesColorWithSlider(window, meshViewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setMeshPointsColorWithSlider(window, meshViewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setMeshEdgesOpacity(window, meshViewerObjectType, OPACITY_50);
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
