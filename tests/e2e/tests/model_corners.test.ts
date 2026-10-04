// Node imports

// Third party imports

// Local imports
import {
  brepGeodeObjectType,
  defaultDataName,
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
  copyModelPointsColor,
  pasteModelPointsColorInput,
  setModelPointsColorInput,
  setModelPointsVertexAttribute,
  setModelPointsVertexAttributeNoDataColor,
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

test("corners visibility", async ({ window }) => {
  await closeAllMenus(window);
  await toggleModelTreeRow(window, "Corners");
});

test("corners color", async ({ window }) => {
  await toggleModelTreeRow(window, "Corners");
  await setModelTreeRowColorRandom(window, "Corners");
});

test("corners copy color to clipboard", async ({ window }) => {
  await copyModelPointsColor(window);
});

test("corners set color via input", async ({ window }) => {
  await setModelPointsColorInput(window, "0, 255, 0");
});

test("corners paste color in input", async ({ window }) => {
  await pasteModelPointsColorInput(window);
});

test("corners vertex attribute all corners", async ({ window }) => {
  await expandMeshComponentType(window, "Corners");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPointsVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
});

test("corners vertex attribute unmapped elements color", async ({ window }) => {
  await setModelPointsVertexAttributeNoDataColor(window);
});

test("corners vertex attribute all corners change item", async ({ window }) => {
  await setModelPointsVertexAttribute(window, vertexAttributeName, { item: 1 });
  await moveMouseOutOfTheWay(window);
});

test("corners vertex attribute one corner", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: vertexAttributeName,
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
});
