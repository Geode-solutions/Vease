// Node imports

// Third party imports

// Local imports
import {
  defaultDataName,
  edgedCurveGeodeObjectType,
  meshViewerObjectType,
} from "@tests/utils/constants.js";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshEdgesMenu,
  setMeshEdgesColorMap,
  setMeshEdgesEdgeAttribute,
  setMeshEdgesItem,
  setMeshEdgesVertexAttribute,
} from "@tests/utils/data/mesh/edges/attribute.js";
import {
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { setMeshEdgesColorWithSlider, setMeshEdgesOpacity } from "@tests/utils/data/mesh/edges/color.js";
import { loadDatas } from "@tests/utils/load.js";
import { setMeshPointsColorWithSlider } from "@tests/utils/data/mesh/points/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test.og_edc3d";
const attributeName = "edges";
const vertexAttributeName = "points";
const colorMapName = "vikO";
const otherVertexAttributeName = "edges_around_vertex";
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, edgedCurveGeodeObjectType, defaultDataName);
});

test("viewer context menu", async ({ window }) => {
  const x = 549;
  const y = 210;
  await viewerContextMenu(window, x, y);
});

test("info card", async ({ window }) => {
  await toggleInfoCard(window);
});

test("points visibility", async ({ window }) => {
  await toggleInfoCard(window);
  const visibility = false;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
});

test("edge attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshEdgesEdgeAttribute(window, attributeName, { item: 1 });
});

test("edge attribute change colormap", async ({ window }) => {
  await setMeshEdgesColorMap(window, colorMapName);
});

test("edge attribute change item to 1", async ({ window }) => {
  await setMeshEdgesItem(window, 0);
});

test("edge attribute change item to 2", async ({ window }) => {
  await setMeshEdgesItem(window, 1);
});

test("edge attribute reopen menu", async ({ window }) => {
  await openMeshEdgesMenu(window);
});

test("vertex attribute", async ({ window }) => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName, {
    item: 2,
    colorMap: colorMapName,
  });
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshEdgesVertexAttribute(window, otherVertexAttributeName);
});

test("vertex attribute switch back to points", async ({ window }) => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName);
});

test("edges color", async ({ window }) => {
  await setMeshEdgesColorWithSlider(window);
});

test("points color", async ({ window }) => {
  await setMeshPointsColorWithSlider(window);
});

test("opacity", async ({ window }) => {
  await setMeshEdgesOpacity(window, OPACITY_50);
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
