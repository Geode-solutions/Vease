// oxlint-disable max-dependencies
// Node imports

// Third party imports
import {
  afterActionWait,
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
import { loadDatas } from "@tests/utils/load.js";
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
const polygonsOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, polygonalSurfaceGeodeObjectType, defaultDataName);
});

test("viewer context menu", async ({ window }) => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
});

test("info card", async ({ window }) => {
  await toggleInfoCard(window);
});

test("points visibility", async ({ window }) => {
  await toggleInfoCard(window);
  const visibility = true;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
});

test("polygon attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshPolygonsPolygonAttribute(window, polygonAttributeName);
  await expect(window).toHaveScreenshot();
});

test("polygon attribute change colormap", async ({ window }) => {
  await setMeshPolygonsColorMap(window, colorMapName);
});

test("polygon attribute reopen menu", async ({ window }) => {
  await openMeshPolygonsMenu(window);
});

test("quick colormap picker change colormap", async ({ window }) => {
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

test("quick colormap picker change range", async ({ window }) => {
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

test("vertex attribute", async ({ window }) => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName, {
    item: 2,
    colorMap: colorMapName,
  });
});

test("vertex attribute change item to 1", async ({ window }) => {
  await setMeshPolygonsItem(window, 0);
});

test("vertex attribute change item to 2", async ({ window }) => {
  await setMeshPolygonsItem(window, 1);
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName2);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute switch back to first attribute", async ({ window }) => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName);
});

test("vertex attribute reopen menu", async ({ window }) => {
  await openMeshPolygonsMenu(window);
});

test("polygons color", async ({ window }) => {
  await setMeshPolygonsColor(window);
});

test("points color", async ({ window }) => {
  await setMeshPointsColor(window);
});

test("edges color", async ({ window }) => {
  await setMeshEdgesColor(window);
});

test("polygons opacity", async ({ window }) => {
  await setMeshPolygonsOpacity(window, polygonsOpacity);
  await expect(window).toHaveScreenshot();
});

test("points size", async ({ window }) => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
  await expect(window).toHaveScreenshot();
});

test("edges width", async ({ window }) => {
  await setEdgesWidth(window, meshViewerObjectType, edgesWidth);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
});

test("polygons visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, true);
  await setPolygonsVisibility(window, meshViewerObjectType, false);
});

test("polygons textures", async ({ window }) => {
  await setPolygonsVisibility(window, meshViewerObjectType, true);
  await setPolygonsTextures(window, meshViewerObjectType);
});
