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
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  defaultDataName,
  edgedCurveGeodeObjectType,
  meshViewerObjectType,
} from "@tests/utils/constants.js";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshEdgesMenu,
  setMeshEdgesEdgeAttribute,
  setMeshEdgesItem,
  setMeshEdgesVertexAttribute,
} from "@tests/utils/mesh/edges/attribute.js";
import { setMeshEdgesColorWithSlider, setMeshEdgesOpacity } from "@tests/utils/mesh/edges/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setMeshPointsColorWithSlider } from "@tests/utils/mesh/points/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_edc3d";
const edgeAttributeName = "test_edge";
const edgeAttributeColorMap = "acton";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const vertexAttributeColorMap = "vikO";
let window = undefined;
let cleanup = undefined;
const edgesOpacity = 50;
const edgesWidth = 5;
const pointsSize = 2;

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
  const x = 549;
  const y = 210;
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

test("edge attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshEdgesEdgeAttribute(window, edgeAttributeName, { colorMap: edgeAttributeColorMap });
  await expect(window).toHaveScreenshot();
});

test("edge attribute change item to 1", async () => {
  await setMeshEdgesItem(window, 0);
  await expect(window).toHaveScreenshot();
});

test("edge attribute change item to 2", async () => {
  await setMeshEdgesItem(window, 1);
  await expect(window).toHaveScreenshot();
});

test("edge attribute reopen menu", async () => {
  await openMeshEdgesMenu(window);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName, {
    item: 2,
    colorMap: vertexAttributeColorMap,
  });
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change attribute name", async () => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName2);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute switch back to first attribute", async () => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setMeshEdgesColorWithSlider(window);
  await expect(window).toHaveScreenshot();
});

test("edges opacity", async () => {
  await setMeshEdgesOpacity(window, edgesOpacity);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await setEdgesWidth(window, meshViewerObjectType, edgesWidth);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  await setEdgesVisibility(window, meshViewerObjectType, true);
});

test("points color", async () => {
  await setMeshPointsColorWithSlider(window);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
  await expect(window).toHaveScreenshot();
});


