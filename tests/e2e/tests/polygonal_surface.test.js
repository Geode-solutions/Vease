// oxlint-disable max-dependencies
// Node imports

// Third party imports
import {
  afterActionWait,
  beforeAllTimeout,
  moveMouseOutOfTheWay,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsTextures,
  setPolygonsVisibility,
  toggleInfoCard,
  viewerContextMenu,
  viewerQuickColormap,
} from "@tests/utils/viewer_interaction.js";
import {
  closeObjectsTree,
  expandMainObjectTree,
  highlightData,
  openObjectsTree,
} from "@tests/utils/object_tree_interaction.js";
import {
  defaultDataName,
  meshViewerObjectType,
  polygonalSurfaceGeodeObjectType,
} from "@tests/utils/constants.js";
import {
  openMeshPolygonsMenu,
  setMeshPolygonsColorMap,
  setMeshPolygonsItem,
  setMeshPolygonsPolygonAttribute,
  setMeshPolygonsVertexAttribute,
} from "@tests/utils/mesh/polygon/attribute.js";
import { setMeshPolygonsColor, setMeshPolygonsOpacity } from "@tests/utils/mesh/polygon/color.js";
import { expect } from "@playwright/test";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setMeshEdgesColor } from "@tests/utils/mesh/edges/color.js";
import { setMeshPointsColor } from "@tests/utils/mesh/points/color.js";
import { setQuickColorMap } from "@tests/utils/helpers/attribute.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_psf3d";
const polygonAttributeName = "test_polygon";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
let window = undefined;
let cleanup = undefined;
const polygonsOpacity = 50;
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
  await highlightData(window, polygonalSurfaceGeodeObjectType, defaultDataName);
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

test("polygon attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshPolygonsPolygonAttribute(window, polygonAttributeName);
  await expect(window).toHaveScreenshot();
});

test("polygon attribute change colormap", async () => {
  await setMeshPolygonsColorMap(window, colorMapName);
  await expect(window).toHaveScreenshot();
});

test("polygon attribute reopen menu", async () => {
  await openMeshPolygonsMenu(window);
  await expect(window).toHaveScreenshot();
});

test("quick colormap picker change colormap", async () => {
  await window.keyboard.press("Escape");
  await closeObjectsTree(window);
  await window.waitForTimeout(afterActionWait);

  const x = 275;
  const y = 650;
  await viewerQuickColormap(window, x, y);
  await setQuickColorMap(window, colorMapName);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("quick colormap picker change range", async () => {
  await window.keyboard.press("Escape");
  await closeObjectsTree(window);
  await window.waitForTimeout(afterActionWait);
  const x = 275;
  const y = 650;
  await viewerQuickColormap(window, x, y);
  const minInput = window
    .getByTestId("attributeMinInput")
    .filter({ visible: true })
    .first()
    .locator("input");
  await minInput.fill("0.2");
  await minInput.press("Enter");
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await openObjectsTree(window);
  await moveMouseOutOfTheWay(window);
});

test("vertex attribute", async () => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName, {
    item: 2,
    colorMap: colorMapName,
  });
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change item to 1", async () => {
  await setMeshPolygonsItem(window, 0);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change item to 2", async () => {
  await setMeshPolygonsItem(window, 1);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change attribute name", async () => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName2);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute switch back to first attribute", async () => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute reopen menu", async () => {
  await openMeshPolygonsMenu(window);
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

test("polygons opacity", async () => {
  await setMeshPolygonsOpacity(window, polygonsOpacity);
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

test("polygons visibility", async () => {
  await setPolygonsVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolygonsVisibility(window, meshViewerObjectType, true);
});

test("polygons textures", async () => {
  await setPolygonsTextures(window, meshViewerObjectType);
  await expect(window).toHaveScreenshot();
});
