// Node imports

// Third party imports

// Local imports
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import { meshViewerObjectType, rgd3dGeodeObjectType } from "@tests/utils/constants";
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
import { setMeshCellsColor, setMeshCellsOpacity } from "@tests/utils/data/mesh/cells/color.js";
import { loadDatas } from "@tests/utils/load.js";
import { setMeshEdgesColor } from "@tests/utils/data/mesh/edges/color.js";
import { setMeshPointsColor } from "@tests/utils/data/mesh/points/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "grid.og_rgd3d";
const attributeName = "int_attribute";
const vertexAttributeName = "points";
const colorMapName = "vikO";
const otherVertexAttributeName = "polyhedra_around_vertex";
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;

test.describe.configure({ mode: "serial" });

test.afterAll(async () => {
  await cleanup();
});

test("load", async ({ window }) => {
  await loadDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, rgd3dGeodeObjectType, "grid");
});

test("viewer context menu", async ({ window }) => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
});

test("info card", async ({ window }) => {
  await toggleInfoCard(window);
  await toggleInfoCard(window);
});

test("points visibility", async ({ window }) => {
  const visibility = true;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
});

test("cell attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshCellsCellAttribute(window, attributeName);
});

test("cell attribute change colormap", async ({ window }) => {
  await setMeshCellsColorMap(window, colorMapName);
});

test("cell attribute reopen menu", async ({ window }) => {
  await openMeshCellsMenu(window);
});

test("vertex attribute", async ({ window }) => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName, {
    item: 1,
    colorMap: colorMapName,
  });
});

test("vertex attribute change item to 1", async ({ window }) => {
  await setMeshCellsItem(window, 0);
});

test("vertex attribute change item to 2", async ({ window }) => {
  await setMeshCellsItem(window, 1);
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshCellsVertexAttribute(window, otherVertexAttributeName);
});

test("vertex attribute switch back to points", async ({ window }) => {
  await setMeshCellsVertexAttribute(window, vertexAttributeName);
});

test("vertex attribute reopen menu", async ({ window }) => {
  await openMeshCellsMenu(window);
});

test("cells color", async ({ window }) => {
  await setMeshCellsColor(window);
});

test("points color", async ({ window }) => {
  await setMeshPointsColor(window);
});

test("edges color", async ({ window }) => {
  await setMeshEdgesColor(window);
});

test("opacity", async ({ window }) => {
  await setMeshCellsOpacity(window, OPACITY_50);
});

test("points size", async ({ window }) => {
  await setPointsSize(window, meshViewerObjectType, POINTS_SIZE);
});

test("edges width", async ({ window }) => {
  await setEdgesWidth(window, meshViewerObjectType, EDGES_WIDTH);
});

test("edges visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
});

test("cells visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, true);
  await setCellsVisibility(window, meshViewerObjectType, false);
});
