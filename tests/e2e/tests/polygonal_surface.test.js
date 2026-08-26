// Node imports

// Third party imports

// Local imports
import {
  defaultDataName,
  meshViewerObjectType,
  polygonalSurfaceGeodeObjectType,
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
const inputFilename = "test.og_psf3d";
const attributeName = "test_attribute";
const vertexAttributeName = "points";
const colorMapName = "vikO";
const otherVertexAttributeName = "polygons_around_vertex";
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const EDGES_WIDTH = 5;

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
  await setMeshPolygonsPolygonAttribute(window, attributeName);
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
  await setMeshPolygonsVertexAttribute(window, otherVertexAttributeName);
});

test("vertex attribute switch back to points", async ({ window }) => {
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
  await setMeshPolygonsOpacity(window, OPACITY_50);
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

test("polygons visibility", async ({ window }) => {
  await setEdgesVisibility(window, meshViewerObjectType, true);
  await setPolygonsVisibility(window, meshViewerObjectType, false);
});

test("polygons textures", async ({ window }) => {
  await setPolygonsVisibility(window, meshViewerObjectType, true);
  await setPolygonsTextures(window, meshViewerObjectType);
});
