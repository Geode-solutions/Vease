// Node imports

// Third party imports

// Local imports
import {
  afterActionWait,
  defaultDataName,
  hybridSolidGeodeObjectType,
} from "@tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@tests/utils/app_interaction";
import {
  expandMainObjectTree,
  highlightData,
  toggleObjectsTree,
} from "@tests/utils/object_tree_interaction";
import {
  getHybridViewerCanvas,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction";
import {
  openMeshPolyhedraMenu,
  setMeshEdgesColor,
  setMeshEdgesVisibility,
  setMeshEdgesWidth,
  setMeshPointsColor,
  setMeshPointsSize,
  setMeshPointsVisibility,
  setMeshPolygonsColor,
  setMeshPolygonsVisibility,
  setMeshPolyhedraColor,
  setMeshPolyhedraColorBlack,
  setMeshPolyhedraColorMap,
  setMeshPolyhedraItem,
  setMeshPolyhedraNoDataColor,
  setMeshPolyhedraOpacity,
  setMeshPolyhedraPolyhedronAttribute,
  setMeshPolyhedraVertexAttribute,
  setMeshPolyhedraVisibility,
} from "@tests/utils/data";
import { loadVeaseTestDatas } from "@tests/utils/load";
import { test } from "@tests/utils/fixtures";

// Constants
const inputFilename = "test.og_hso3d";
const polyhedronAttributeName = "test_polyhedron";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
const polyhedraOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;
const ZOOM_WHEEL_DELTA = -5000;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadVeaseTestDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, hybridSolidGeodeObjectType, defaultDataName);
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

test("polyhedron attribute", async ({ window }) => {
  await setMeshPointsVisibility(window, false);
  await setMeshPolyhedraPolyhedronAttribute(window, polyhedronAttributeName);
});

test("polyhedron attribute change colormap", async ({ window }) => {
  await setMeshPolyhedraColorMap(window, colorMapName);
});

test("polyhedron attribute reopen menu", async ({ window }) => {
  await openMeshPolyhedraMenu(window);
});

test("vertex attribute", async ({ window }) => {
  await setMeshPolyhedraVertexAttribute(window, vertexAttributeName, {
    item: 2,
    colorMap: colorMapName,
  });
});

test("vertex attribute unmapped elements color", async ({ window }) => {
  await setMeshPolyhedraNoDataColor(window);
});

test("vertex attribute change item to 1", async ({ window }) => {
  await setMeshPolyhedraItem(window, 0);
});

test("vertex attribute change item to 2", async ({ window }) => {
  await setMeshPolyhedraItem(window, 1);
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshPolyhedraVertexAttribute(window, vertexAttributeName2);
});

test("vertex attribute switch back to first attribute", async ({ window }) => {
  await setMeshPolyhedraVertexAttribute(window, vertexAttributeName);
});

test("vertex attribute reopen menu", async ({ window }) => {
  await openMeshPolyhedraMenu(window);
});

test("polyhedra color", async ({ window }) => {
  await setMeshPolyhedraColor(window);
});

test("points color", async ({ window }) => {
  await setMeshPointsColor(window);
});

test("edges color", async ({ window }) => {
  await setMeshEdgesColor(window);
});

test("polygons color", async ({ window }) => {
  await setMeshPolygonsColor(window);
});

test("opacity", async ({ window }) => {
  await setMeshPolyhedraOpacity(window, polyhedraOpacity);
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

test("polyhedra visibility", async ({ window }) => {
  await setMeshPolygonsVisibility(window, true);
  await setMeshPolyhedraVisibility(window, false);
});

test("reopen treeview over zoomed dark data adaptive style", async ({ window }) => {
  await setMeshPolyhedraColorBlack(window);
  await closeAllMenus(window);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  await hybridViewerCanvas.hover({ position: { x: box.width / 2, y: box.height / 2 } });
  await window.mouse.wheel(0, ZOOM_WHEEL_DELTA);
  await window.waitForTimeout(afterActionWait);
  await toggleObjectsTree(window);
  await toggleObjectsTree(window);
  await moveMouseOutOfTheWay(window);
});
