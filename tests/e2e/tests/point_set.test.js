// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  defaultDataName,
  meshViewerObjectType,
  pointSetGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshPointsMenu,
  setMeshPointsVertexAttribute,
} from "@tests/utils/mesh/points/attribute.js";
import { setMeshPointsColor, setMeshPointsOpacity } from "@tests/utils/mesh/points/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_pts3d";
const vertexAttributeName = "test_vertex";
let window = undefined;
let cleanup = undefined;
const pointsOpacity = 50;
const pointsSize = 15;

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
  await highlightData(window, pointSetGeodeObjectType, defaultDataName);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("info card", async () => {
  await toggleInfoCard(window);
  await expect(window).toHaveScreenshot();
  await toggleInfoCard(window);
});

test("points visibility", async () => {
  const visibility = false;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshPointsVertexAttribute(window, vertexAttributeName);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute reopen menu", async () => {
  await openMeshPointsMenu(window);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setMeshPointsColor(window);
  await expect(window).toHaveScreenshot();
});

test("points opacity", async () => {
  await setMeshPointsOpacity(window, pointsOpacity);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
  await expect(window).toHaveScreenshot();
});
