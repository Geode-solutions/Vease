// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
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
} from "@tests/utils/mesh/polyhedra/attribute.js";
import {
  setMeshPolyhedraColor,
  setMeshPolyhedraOpacity,
} from "@tests/utils/mesh/polyhedra/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setMeshEdgesColor } from "@tests/utils/mesh/edges/color.js";
import { setMeshPointsColor } from "@tests/utils/mesh/points/color.js";
import { setMeshPolygonsColor } from "@tests/utils/mesh/polygon/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_tso3d";
const polyhedronAttributeName = "test_polyhedron";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
let window = undefined;
let cleanup = undefined;
const polyhedraOpacity = 50;
const pointsSize = 15;
const edgesWidth = 5;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, tetrahedralSolidGeodeObjectType, defaultDataName);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("info card", async () => {
  await toggleInfoCard(window);
  await expect(window).toHaveScreenshot();
  await toggleInfoCard(window);
});

test("points visibility", async () => {
  const visibility = true;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshPolyhedraPolyhedronAttribute(window, polyhedronAttributeName);
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute change colormap", async () => {
  await setMeshPolyhedraColorMap(window, colorMapName);
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute reopen menu", async () => {
  await openMeshPolyhedraMenu(window);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setMeshPolyhedraVertexAttribute(window, vertexAttributeName, {
    item: 2,
    colorMap: colorMapName,
  });
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change item to 1", async () => {
  await setMeshPolyhedraItem(window, 0);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change item to 2", async () => {
  await setMeshPolyhedraItem(window, 1);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change attribute name", async () => {
  await setMeshPolyhedraVertexAttribute(window, vertexAttributeName2);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute switch back to first attribute", async () => {
  await setMeshPolyhedraVertexAttribute(window, vertexAttributeName);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute reopen menu", async () => {
  await openMeshPolyhedraMenu(window);
  await expect(window).toHaveScreenshot();
});

test("polyhedra color", async () => {
  await setMeshPolyhedraColor(window);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setMeshPointsColor(window);
  await expect(window).toHaveScreenshot();
});

test("edges color", async () => {
  await setMeshEdgesColor(window);
  await expect(window).toHaveScreenshot();
});

test("polygons color", async () => {
  await setMeshPolygonsColor(window);
  await expect(window).toHaveScreenshot();
});

test("polyhedra opacity", async () => {
  await setMeshPolyhedraOpacity(window, polyhedraOpacity);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
  await expect(window).toHaveScreenshot();
});

test("edges width", async () => {
  await setEdgesWidth(window, meshViewerObjectType, edgesWidth);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setEdgesVisibility(window, meshViewerObjectType, true);
});

test("polygons visibility", async () => {
  await setPolygonsVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolygonsVisibility(window, meshViewerObjectType, true);
});

test("polyhedra visibility", async () => {
  await setPolyhedraVisibility(window, meshViewerObjectType, false);
  await expect(window).toHaveScreenshot();
  // Revert
  await setPolyhedraVisibility(window, meshViewerObjectType, true);
});
