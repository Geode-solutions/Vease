// oxlint-disable max-dependencies
// Node imports

// Third party imports
import {
  afterActionWait,
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
import { defaultDataName, polygonalSurfaceGeodeObjectType } from "@tests/utils/constants.js";
import {
  openMeshPolygonsMenu,
  setMeshEdgesColor,
  setMeshEdgesVisibility,
  setMeshEdgesWidth,
  setMeshPointsColor,
  setMeshPointsSize,
  setMeshPointsVisibility,
  setMeshPolygonsColor,
  setMeshPolygonsColorMap,
  setMeshPolygonsItem,
  setMeshPolygonsNoDataColor,
  setMeshPolygonsOpacity,
  setMeshPolygonsPolygonAttribute,
  setMeshPolygonsTextures,
  setMeshPolygonsVertexAttribute,
  setMeshPolygonsVisibility,
} from "@tests/utils/data/index.js";
import { loadVeaseTestDatas } from "@tests/utils/load.js";
import { moveMouseOutOfTheWay } from "@tests/utils/app_interaction.js";
import { setQuickColorMap } from "@tests/utils/data/helpers/attribute.js";
import { test } from "@tests/utils/fixtures.js";

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
  await loadVeaseTestDatas(window, [inputFilename]);
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
  await setMeshPointsVisibility(window, visibility);
});

test("polygon attribute", async ({ window }) => {
  await setMeshPointsVisibility(window, false);
  await setMeshPolygonsPolygonAttribute(window, polygonAttributeName);
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

  await viewerQuickColormap(window);
  await setQuickColorMap(window, colorMapName);
  await moveMouseOutOfTheWay(window);

  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("quick colormap picker change range", async ({ window }) => {
  await window.keyboard.press("Escape");
  await closeObjectsTree(window);
  await window.waitForTimeout(afterActionWait);
  await viewerQuickColormap(window);
  const minInput = window
    .getByTestId("attributeMinInput")
    .filter({ visible: true })
    .first()
    .locator("input");
  await minInput.fill("0.2");
  await minInput.press("Enter");
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);

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

test("vertex attribute unmapped elements color", async ({ window }) => {
  await setMeshPolygonsNoDataColor(window);
});

test("vertex attribute change item to 1", async ({ window }) => {
  await setMeshPolygonsItem(window, 0);
});

test("vertex attribute change item to 2", async ({ window }) => {
  await setMeshPolygonsItem(window, 1);
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName2);
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
});

test("points size", async ({ window }) => {
  await setMeshPointsSize(window, pointsSize);
});

test("edges width", async ({ window }) => {
  await setMeshEdgesWidth(window, edgesWidth);
});

test("edges visibility", async ({ window }) => {
  await setMeshEdgesVisibility(window, false);
});

test("polygons visibility", async ({ window }) => {
  // Revert
  await setMeshEdgesVisibility(window, true);
  await setMeshPolygonsVisibility(window, false);
});

test("polygons textures", async ({ window }) => {
  await setMeshPolygonsVisibility(window, true);
  await setMeshPolygonsTextures(window);
});
