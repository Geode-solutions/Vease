// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  defaultDataName,
  meshViewerObjectType,
  rgd2dGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshCellsMenu,
  setMeshCellsCellAttribute,
  setMeshCellsColorMap,
  setMeshCellsItem,
  setMeshCellsVertexAttribute,
} from "@tests/utils/mesh/cells/attribute.js";
import { setMeshCellsColorWithSlider, setMeshCellsOpacity } from "@tests/utils/mesh/cells/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setMeshEdgesColorWithSlider } from "@tests/utils/mesh/edges/color.js";
import { setMeshPointsColorWithSlider } from "@tests/utils/mesh/points/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_rgd2d";
const cellAttributeName = "test_cell";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
let window = undefined;
let cleanup = undefined;
const cellsOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;

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
  await highlightData(window, rgd2dGeodeObjectType, defaultDataName);
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
  const visibility = true;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("cell attribute", async () => {
  await setMeshCellsCellAttribute(window, cellAttributeName, { item: 1 });
  await expect(window).toHaveScreenshot();
});

test("cell attribute change colormap", async () => {
  await setMeshCellsColorMap(window, colorMapName);
  await expect(window).toHaveScreenshot();
});

test("cell attribute change item to 1", async () => {
  await setMeshCellsItem(window, 0);
  await expect(window).toHaveScreenshot();
});

test("cell attribute change item to 2", async () => {
  await setMeshCellsItem(window, 1);
  await expect(window).toHaveScreenshot();
});

test("cell attribute reopen menu", async () => {
  await openMeshCellsMenu(window);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshCellsVertexAttribute(window, vertexAttributeName, {
    item: 1,
    colorMap: colorMapName,
  });
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change attribute name", async () => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName2);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute switch back to first attribute", async () => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute reopen menu", async () => {
  await openMeshCellsMenu(window);
  await expect(window).toHaveScreenshot();
});

test("cells color", async () => {
  await setMeshCellsColorWithSlider(window);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setMeshPointsColorWithSlider(window);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setMeshEdgesColorWithSlider(window);
  await expect(window).toHaveScreenshot();
});

test("cells opacity", async () => {
  await setMeshCellsOpacity(window, cellsOpacity);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
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

test("cells visibility", async () => {
  await setCellsVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  await setCellsVisibility(window, meshViewerObjectType, true);
});
