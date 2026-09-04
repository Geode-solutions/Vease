// Node imports

// Third party imports

// Local imports
import {
  defaultDataName,
  meshViewerObjectType,
  pointSetGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction.js";
import {
  openMeshPointsMenu,
  setMeshPointsVertexAttribute,
} from "@tests/utils/data/mesh/points/attribute.js";
import { setMeshPointsColor, setMeshPointsOpacity } from "@tests/utils/data/mesh/points/color.js";
import {
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { loadDatas } from "@tests/utils/load.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test.og_pts3d";
const vertexAttributeName = "test_vertex";
const pointsOpacity = 50;
const pointsSize = 15;

test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadDatas(window, [inputFilename]);
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
  await setPointsVisibility(window, meshViewerObjectType, false);
});

test("vertex attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, true);
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
  await setPointsSize(window, meshViewerObjectType, pointsSize);
});
