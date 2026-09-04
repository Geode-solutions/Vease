// Node imports

// Third party imports

// Local imports
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
} from "@tests/utils/data/mesh/cells/attribute.js";
import {
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { setMeshCellsColorWithSlider, setMeshCellsOpacity } from "@tests/utils/data/mesh/cells/color.js";
import { loadDatas } from "@tests/utils/load.js";
import { setMeshEdgesColorWithSlider } from "@tests/utils/data/mesh/edges/color.js";
import { setMeshPointsColorWithSlider } from "@tests/utils/data/mesh/points/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test.og_rgd2d";
const cellAttributeName = "test_cell";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
const cellsOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, rgd2dGeodeObjectType, defaultDataName);
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

test("cell attribute", async ({ window }) => {
  await setMeshCellsCellAttribute(window, cellAttributeName, { item: 1 });
});

test("cell attribute change colormap", async ({ window }) => {
  await setMeshCellsColorMap(window, colorMapName);
});

test("cell attribute change item to 1", async ({ window }) => {
  await setMeshCellsItem(window, 0);
});

test("cell attribute change item to 2", async ({ window }) => {
  await setMeshCellsItem(window, 1);
});

test("cell attribute reopen menu", async ({ window }) => {
  await openMeshCellsMenu(window);
});

test("vertex attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshCellsVertexAttribute(window, vertexAttributeName, {
    item: 1,
    colorMap: colorMapName,
  });
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName2);
});

test("vertex attribute switch back to first attribute", async ({ window }) => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName);
});

test("vertex attribute reopen menu", async ({ window }) => {
  await openMeshCellsMenu(window);
});

test("cells color", async ({ window }) => {
  await setMeshCellsColorWithSlider(window);
});

test("points color", async ({ window }) => {
  await setMeshPointsColorWithSlider(window);
});

test("edges color", async ({ window }) => {
  await setMeshEdgesColorWithSlider(window);
});

test("cells opacity", async ({ window }) => {
  await setMeshCellsOpacity(window, cellsOpacity);
});

test("points size", async ({ window }) => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
});

test("edges width", async ({ window }) => {
  await setEdgesWidth(window, meshViewerObjectType, edgesWidth);
});

test("edges visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
});

test("cells visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, true);
  await setCellsVisibility(window, meshViewerObjectType, false);
});
