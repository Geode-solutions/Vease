// Node imports

// Third party imports

// Local imports
import {
  defaultDataName,
  meshViewerObjectType,
  triangulatedSurfaceGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshPolygonsMenu,
  setMeshPolygonsColorMap,
  setMeshPolygonsItem,
  setMeshPolygonsPolygonAttribute,
  setMeshPolygonsVertexAttribute,
} from "@tests/utils/data/mesh/polygon/attribute.js";
import {
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsTextures,
  setPolygonsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  setMeshPolygonsColor,
  setMeshPolygonsOpacity,
} from "@tests/utils/data/mesh/polygon/color.js";
import { loadDatas } from "@tests/utils/load.js";
import { setMeshEdgesColor } from "@tests/utils/data/mesh/edges/color.js";
import { setMeshPointsColor } from "@tests/utils/data/mesh/points/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test.og_tsf3d";
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
  await highlightData(window, triangulatedSurfaceGeodeObjectType, defaultDataName);
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
  await setPointsVisibility(window, meshViewerObjectType, true);
});

test("polygon attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshPolygonsPolygonAttribute(window, polygonAttributeName);
});

test("polygon attribute change colormap", async ({ window }) => {
  await setMeshPolygonsColorMap(window, colorMapName);
});

test("polygon attribute reopen menu", async ({ window }) => {
  await openMeshPolygonsMenu(window);
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

test("opacity", async ({ window }) => {
  await setMeshPolygonsOpacity(window, polygonsOpacity);
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

test("polygons visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, true);
  await setPolygonsVisibility(window, meshViewerObjectType, false);
});

test("polygons textures", async ({ window }) => {
  await setPolygonsVisibility(window, meshViewerObjectType, true);
  await setPolygonsTextures(window, meshViewerObjectType);
});
