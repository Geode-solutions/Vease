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
const OPACITY_50 = 50;
const POINTS_SIZE = 15;

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
  const visibility = false;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
});

test("vertex attribute", async ({ window }) => {
  await setPointsVisibility(window, meshViewerObjectType, true);
  await setMeshPointsVertexAttribute(window);
});

test("vertex attribute reopen menu", async ({ window }) => {
  await openMeshPointsMenu(window);
});

test("color", async ({ window }) => {
  await setMeshPointsColor(window);
});

test("opacity", async ({ window }) => {
  await setMeshPointsOpacity(window, OPACITY_50);
});

test("points size", async ({ window }) => {
  await setPointsSize(window, meshViewerObjectType, POINTS_SIZE);
});
