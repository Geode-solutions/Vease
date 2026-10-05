// Node imports

// Third party imports

// Local imports
import {
  brepGeodeObjectType,
  defaultDataName,
  edgeAttributeType,
  vertexAttributeType,
} from "@vease_tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  collapseModelComponentTypes,
  expandMeshComponentType,
  getModelComponentsObjectTree,
  hideAllComponentLeafRows,
  openModelComponentContextMenu,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
  toggleModelTreeRow,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import {
  copyModelEdgesColor,
  pasteModelEdgesColorInput,
  setModelEdgesColorInput,
  setModelEdgesEdgeAttribute,
  setModelEdgesVertexAttribute,
  setModelEdgesVertexAttributeNoDataColor,
} from "@vease_tests/utils/data";
import { applyAttribute } from "@vease_tests/utils/data/helpers/attribute";
import { expandMainObjectTree } from "@vease_tests/utils/object_trees/main_object_tree";
import { hideObjectInTree } from "@vease_tests/utils/object_trees/common";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const brepFilename = "test.og_brep";
const vertexAttributeName = "test_vertex";
const edgeAttributeName = "test_edge";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep and open model components", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await hideObjectInTree(window, "Blocks", undefined, getModelComponentsObjectTree(window));
  await hideAllComponentLeafRows(window, "Surfaces");
  await collapseModelComponentTypes(window);
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
});

test("lines visibility", async ({ window }) => {
  await closeAllMenus(window);
  await collapseModelComponentTypes(window);
  await toggleModelTreeRow(window, "Lines");
});

test("lines color", async ({ window }) => {
  await toggleModelTreeRow(window, "Lines");
  await setModelTreeRowColorRandom(window, "Lines");
});

test("lines copy color to clipboard", async ({ window }) => {
  await copyModelEdgesColor(window);
});

test("lines set color via input", async ({ window }) => {
  await setModelEdgesColorInput(window, "0, 255, 0");
});

test("lines paste color in input", async ({ window }) => {
  await pasteModelEdgesColorInput(window);
});

test("lines vertex attribute all lines", async ({ window }) => {
  await expandMeshComponentType(window, "Lines");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelEdgesVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
});

test("lines vertex attribute unmapped elements color", async ({ window }) => {
  await setModelEdgesVertexAttributeNoDataColor(window);
});

test("lines vertex attribute all lines change item", async ({ window }) => {
  await setModelEdgesVertexAttribute(window, vertexAttributeName, { item: 1 });
  await moveMouseOutOfTheWay(window);
});

test("lines vertex attribute one line", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: vertexAttributeName,
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
});

test("lines edge attribute all lines", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelEdgesEdgeAttribute(window, edgeAttributeName, { item: 0 });
  await moveMouseOutOfTheWay(window);
});

test("lines edge attribute one line", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: edgeAttributeType,
    attributeName: edgeAttributeName,
    item: 0,
  });
  await moveMouseOutOfTheWay(window);
});
