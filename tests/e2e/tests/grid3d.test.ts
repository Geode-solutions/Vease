// Node imports

// Third party imports
import type { Page } from "@playwright/test";
// oxlint-disable-next-line eslint/no-duplicate-imports
import { expect } from "@playwright/test";

// Local imports
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction";
import { meshViewerObjectType, rgd3dGeodeObjectType } from "@tests/utils/constants";
import {
  noopCleanup,
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction";
import {
  openMeshCellsMenu,
  setMeshCellsCellAttribute,
  setMeshCellsColorMap,
  setMeshCellsItem,
  setMeshCellsNoDataColor,
  setMeshCellsVertexAttribute,
} from "@tests/utils/mesh/cells/attribute";
import { setMeshCellsColor, setMeshCellsOpacity } from "@tests/utils/mesh/cells/color";
import { loadData } from "@tests/utils/load";
import { navigateToApp } from "@tests/utils/navigate";
import { setMeshEdgesColor } from "@tests/utils/mesh/edges/color";
import { setMeshPointsColor } from "@tests/utils/mesh/points/color";
import { test } from "@tests/fixtures";

// Constants
const inputFilename = "grid.og_rgd3d";
const cellAttributeName = "test_cell";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
let window: Page = undefined as unknown as Page;
let cleanup: () => unknown = noopCleanup;
const cellsOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
});

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, rgd3dGeodeObjectType, "grid");
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
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshCellsCellAttribute(window, cellAttributeName);
  await expect(window).toHaveScreenshot();
});

test("cell attribute change colormap", async () => {
  await setMeshCellsColorMap(window, colorMapName);
  await expect(window).toHaveScreenshot();
});

test("cell attribute reopen menu", async () => {
  await openMeshCellsMenu(window);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName, {
    item: 1,
    colorMap: colorMapName,
  });
  await expect(window).toHaveScreenshot();
});

test("vertex attribute unmapped elements color", async () => {
  await setMeshCellsNoDataColor(window);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change item to 1", async () => {
  await setMeshCellsItem(window, 0);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change item to 2", async () => {
  await setMeshCellsItem(window, 1);
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
  await setMeshCellsColor(window);
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
  // Revert
  await setEdgesVisibility(window, meshViewerObjectType, true);
});

test("cells visibility", async () => {
  await setCellsVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setCellsVisibility(window, meshViewerObjectType, true);
});
