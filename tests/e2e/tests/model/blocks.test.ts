// Node imports

// Third party imports

// Local imports
import {
  brepGeodeObjectType,
  defaultDataName,
  polyhedronAttributeType,
  vertexAttributeType,
} from "#ogw_e2e/constants.js";
import { closeAllMenus, moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import {
  copyModelPolyhedraColor,
  pasteModelPolyhedraColorInput,
  setModelPolyhedraColorInput,
  setModelPolyhedraPolyhedronAttribute,
  setModelPolyhedraVertexAttribute,
  setModelPolyhedraVertexAttributeNoDataColor,
} from "#ogw_e2e/data/index.js";
import {
  expandMeshComponentType,
  getModelComponentsObjectTree,
  hideAllComponentLeafRows,
  hoverLines,
  hoverSurfaces,
  openModelComponentContextMenu,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
  toggleModelTreeRow,
} from "#ogw_e2e/object_trees/model_components_object_tree.js";
import { applyAttribute } from "#ogw_e2e/data/helpers/attribute.js";
import { expandMainObjectTree } from "#ogw_e2e/object_trees/main_object_tree.js";
import { hideObjectInTree } from "#ogw_e2e/object_trees/common.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const brepFilename = "test.og_brep";
const vertexAttributeName = "test_vertex";
const polyhedronAttributeName = "test_polyhedron";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
});

test("object tree model components", async ({ window }) => {
  await closeAllMenus(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await hideObjectInTree(window, "Blocks", undefined, getModelComponentsObjectTree(window));
  await hideAllComponentLeafRows(window, "Surfaces");
  await moveMouseOutOfTheWay(window);
});

test("object tree hover lines", async ({ window }) => {
  await hoverLines(window);
});

test("object tree hover first surface", async ({ window }) => {
  await hoverSurfaces(window, "00000000-");
});

test("blocks visibility", async ({ window }) => {
  await toggleModelTreeRow(window, "Blocks");
});

test("blocks color", async ({ window }) => {
  await setModelTreeRowColorRandom(window, "Blocks");
});

test("blocks copy color to clipboard", async ({ window }) => {
  await copyModelPolyhedraColor(window);
});

test("blocks set color via input", async ({ window }) => {
  await setModelPolyhedraColorInput(window, "0, 255, 0");
});

test("blocks paste color in input", async ({ window }) => {
  await pasteModelPolyhedraColorInput(window);
});

test("blocks vertex attribute all blocks one component", async ({ window }) => {
  await expandMeshComponentType(window, "Blocks");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolyhedraVertexAttribute(window, vertexAttributeName, {
    item: 0,
    colorMap: "vikO",
  });
  await moveMouseOutOfTheWay(window);
});

test("blocks vertex attribute unmapped elements color one component", async ({ window }) => {
  await setModelPolyhedraVertexAttributeNoDataColor(window);
});

test("blocks vertex attribute all blocks change item one component", async ({ window }) => {
  await setModelPolyhedraVertexAttribute(window, vertexAttributeName, { item: 1 });
  await moveMouseOutOfTheWay(window);
});

test("blocks vertex attribute one block one component", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: vertexAttributeName,
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
});

test("blocks polyhedron attribute all blocks one component", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolyhedraPolyhedronAttribute(window, polyhedronAttributeName);
  await moveMouseOutOfTheWay(window);
});

test("blocks polyhedron attribute one block one component", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: polyhedronAttributeType,
    attributeName: polyhedronAttributeName,
  });
  await moveMouseOutOfTheWay(window);
});
