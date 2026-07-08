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
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  setEdgesColorWithSlider,
  setEdgesOpacity,
  setPointsColorWithSlider,
} from "@tests/utils/coloring_style/mesh/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setEdgesEdgeAttribute } from "@tests/utils/coloring_style/mesh/attribute.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_edc3d";
const dataName = "test";
const attributeName = "edges";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;
const geodeObjectType = "EdgedCurve3D";
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
  await highlightData(window, geodeObjectType, dataName);
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
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("edge attribute", async () => {
  await setPointsVisibility(window, viewerObjectType, true);
  await setEdgesEdgeAttribute(window, viewerObjectType, attributeName);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setEdgesColorWithSlider(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setPointsColorWithSlider(window, viewerObjectType);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setEdgesOpacity(window, viewerObjectType, OPACITY_50);
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
  await setEdgesVisibility(window, viewerObjectType, true);
});
