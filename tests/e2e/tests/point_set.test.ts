// Node imports

// Third party imports

// Local imports
import { defaultDataName, pointSetGeodeObjectType } from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction";
import {
  openMeshPointsMenu,
  setMeshPointsColor,
  setMeshPointsNoDataColor,
  setMeshPointsOpacity,
  setMeshPointsSize,
  setMeshPointsVertexAttribute,
  setMeshPointsVisibility,
} from "@tests/utils/data/index";
import { toggleInfoCard, viewerContextMenu } from "@tests/utils/viewer_interaction";
import { loadVeaseTestDatas } from "@tests/utils/load";
import { test } from "@tests/utils/fixtures";

// Constants
const inputFilename = "test.og_pts3d";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
const pointsOpacity = 50;
const pointsSize = 15;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadVeaseTestDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, pointSetGeodeObjectType, defaultDataName);
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
  await setMeshPointsVisibility(window, false);
});

test("vertex attribute", async ({ window }) => {
  await setMeshPointsVisibility(window, false);
  await setMeshPointsVertexAttribute(window, vertexAttributeName, {
    item: 1,
    colorMap: colorMapName,
  });
});

test("vertex attribute unmapped elements color", async ({ window }) => {
  await setMeshPointsNoDataColor(window);
});

test("vertex attribute change attribute name", async ({ window }) => {
  await setMeshPointsVertexAttribute(window, vertexAttributeName2);
});

test("vertex attribute switch back to first attribute", async ({ window }) => {
  await setMeshPointsVertexAttribute(window, vertexAttributeName);
});

test("vertex attribute reopen menu", async ({ window }) => {
  await openMeshPointsMenu(window);
});

test("points color", async ({ window }) => {
  await setMeshPointsColor(window);
});

test("points opacity", async ({ window }) => {
  await setMeshPointsOpacity(window, pointsOpacity);
});

test("points size", async ({ window }) => {
  await setMeshPointsSize(window, pointsSize);
});
