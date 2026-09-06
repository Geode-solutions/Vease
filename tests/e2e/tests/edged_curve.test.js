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
import {
  setMeshEdgesColorWithSlider,
  setMeshEdgesOpacity,
} from "@tests/utils/data/mesh/edges/color.js";
import { loadDatas } from "@tests/utils/load.js";
import { setMeshPointsColorWithSlider } from "@tests/utils/data/mesh/points/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test.og_edc3d";
const edgeAttributeName = "test_edge";
const edgeAttributeColorMap = "acton";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const vertexAttributeColorMap = "vikO";
const edgesOpacity = 50;
const edgesWidth = 5;
const pointsSize = 2;

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
  const pointsVisibility = false;
  await setPointsVisibility(window, meshViewerObjectType, pointsVisibility);
});

test("edge attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshEdgesEdgeAttribute(window, edgeAttributeName, { colorMap: edgeAttributeColorMap });
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
    colorMap: vertexAttributeColorMap,
  });
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName2);
});

test("vertex attribute switch back to first attribute", async ({ window }) => {
  await setMeshEdgesVertexAttribute(window, vertexAttributeName);
});

test("edges color", async ({ window }) => {
  await setMeshEdgesColorWithSlider(window);
});

test("edges opacity", async ({ window }) => {
  await setMeshEdgesOpacity(window, edgesOpacity);
});

test("edges width", async ({ window }) => {
  await setEdgesWidth(window, meshViewerObjectType, edgesWidth);
});

test("edges visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
});

test("points color", async ({ window }) => {
  await setMeshPointsColorWithSlider(window);
});

test("points size", async ({ window }) => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
});
