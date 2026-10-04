// Node imports

// Third party imports

// Local imports
import {
  brepGeodeObjectType,
  defaultDataName,
  polyhedronAttributeType,
  structuralModelGeodeObjectType,
  vertexAttributeType,
} from "@vease_tests/utils/constants";
import {
  expandGeodeObjectTypeInTree,
  hideObjectInTree,
} from "@vease_tests/utils/object_trees/common";
import {
  expandMainObjectTree,
  getMainObjectTree,
  toggleObjectsTree,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  openModelComponentContextMenu,
  openModelComponentsTree,
  toggleModelTreeRow,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import {
  setModelEdgesVisibility,
  setModelPointsVisibility,
  setModelPolyhedraPolyhedronAttribute,
  setModelPolyhedraVertexAttribute,
  setModelPolyhedraVertexAttributeNoDataColor,
} from "@vease_tests/utils/data";
import { applyAttribute } from "@vease_tests/utils/data/helpers/attribute";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import { resetCamera } from "@vease_tests/utils/camera_interaction";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const brepFilename = "test.og_brep";
const structuralModelFilename = "test.og_strm";
const vertexAttributeName = "test_vertex";
const polyhedronAttributeName = "test_polyhedron";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep and open model components", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await moveMouseOutOfTheWay(window);
});

test("load structural model", async ({ window }) => {
  await loadVeaseTestDatas(window, [structuralModelFilename]);
  await expandMainObjectTree(window);
});

test("toggle both model component trees", async ({ window }) => {
  await hideObjectInTree(window, "BRep", undefined, getMainObjectTree(window));
  await resetCamera(window);
  await openModelComponentsTree(window, structuralModelGeodeObjectType, defaultDataName);
  await resetCamera(window);
  await toggleObjectsTree(window);
  await moveMouseOutOfTheWay(window);
});

test("show points of surface in model tree", async ({ window }) => {
  await toggleModelTreeRow(window, "Surfaces", 0, 1);
  const secondModelTree = window.getByTestId("modelComponentsObjectTree").nth(1);
  await expandGeodeObjectTypeInTree(window, "Surfaces", secondModelTree);
  await openModelComponentContextMenu(window, "019ea682-", 0, 1);
  await setModelPointsVisibility(window, true);
  await moveMouseOutOfTheWay(window);
});

test("show edges of surface in model tree", async ({ window }) => {
  await openModelComponentContextMenu(window, "019ea682-", 0, 1);
  await setModelEdgesVisibility(window, true);
  await moveMouseOutOfTheWay(window);
});

test("hide edges and points of surface in model tree", async ({ window }) => {
  await openModelComponentContextMenu(window, "019ea682-", 0, 1);
  await setModelEdgesVisibility(window, false);
  await setModelPointsVisibility(window, false);
  await moveMouseOutOfTheWay(window);
});

test("blocks vertex attribute all blocks", async ({ window }) => {
  const secondModelTree = window.getByTestId("modelComponentsObjectTree").nth(1);
  await expandGeodeObjectTypeInTree(window, "Blocks", secondModelTree);
  await openModelComponentContextMenu(window, "019ea699-", 0, 1);
  await setModelPolyhedraVertexAttribute(window, vertexAttributeName, {
    item: 0,
    colorMap: "vikO",
  });
  await moveMouseOutOfTheWay(window);
});

test("blocks vertex attribute unmapped elements color", async ({ window }) => {
  await setModelPolyhedraVertexAttributeNoDataColor(window);
});

test("blocks vertex attribute all blocks change item", async ({ window }) => {
  await setModelPolyhedraVertexAttribute(window, vertexAttributeName, { item: 1 });
  await moveMouseOutOfTheWay(window);
});

test("blocks vertex attribute one block", async ({ window }) => {
  const secondModelTree = window.getByTestId("modelComponentsObjectTree").nth(1);
  await expandGeodeObjectTypeInTree(window, "Blocks", secondModelTree);
  await openModelComponentContextMenu(window, "019ea699-", 3, 1);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: vertexAttributeName,
    colorMap: "roma",
  });
});

test("blocks polyhedron attribute all blocks", async ({ window }) => {
  await openModelComponentContextMenu(window, "019ea699-", 0, 1);
  await setModelPolyhedraPolyhedronAttribute(window, polyhedronAttributeName, { item: 2 });
  await moveMouseOutOfTheWay(window);
});

test("blocks polyhedron attribute one block", async ({ window }) => {
  await openModelComponentContextMenu(window, "019ea699-", 3, 1);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: polyhedronAttributeType,
    attributeName: polyhedronAttributeName,
  });
  await moveMouseOutOfTheWay(window);
});
