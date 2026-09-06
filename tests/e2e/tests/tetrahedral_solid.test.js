// Node imports

// Third party imports

// Local imports
import {
  defaultDataName,
  meshViewerObjectType,
  tetrahedralSolidGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshPolyhedraMenu,
  setMeshPolyhedraColorMap,
  setMeshPolyhedraItem,
  setMeshPolyhedraPolyhedronAttribute,
  setMeshPolyhedraVertexAttribute,
} from "@tests/utils/data/mesh/polyhedra/attribute.js";
import {
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsVisibility,
  setPolyhedraVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  setMeshPolyhedraColor,
  setMeshPolyhedraOpacity,
} from "@tests/utils/data/mesh/polyhedra/color.js";
import { loadDatas } from "@tests/utils/load.js";
import { setMeshEdgesColor } from "@tests/utils/data/mesh/edges/color.js";
import { setMeshPointsColor } from "@tests/utils/data/mesh/points/color.js";
import { setMeshPolygonsColor } from "@tests/utils/data/mesh/polygon/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test.og_tso3d";
const polyhedronAttributeName = "test_polyhedron";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
const polyhedraOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, tetrahedralSolidGeodeObjectType, defaultDataName);
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

test("polyhedron attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, false);
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

test("polyhedra opacity", async ({ window }) => {
  await setMeshPolyhedraOpacity(window, polyhedraOpacity);
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

test("polyhedra visibility", async ({ window }) => {
  await setPolygonsVisibility(window, meshViewerObjectType, true);
  await setPolyhedraVisibility(window, meshViewerObjectType, false);
});
