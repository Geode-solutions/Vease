// Node imports

// Third party imports

// Local imports
import {
  brepGeodeObjectType,
  defaultDataName,
  polygonAttributeType,
  vertexAttributeType,
} from "@vease_tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  copyModelPolygonsColor,
  pasteModelPolygonsColorInput,
  setModelColor,
  setModelPointsVisibility,
  setModelPolygonsColorInput,
  setModelPolygonsPolygonAttribute,
  setModelPolygonsVertexAttribute,
  setModelPolygonsVertexAttributeNoDataColor,
} from "@vease_tests/utils/data";
import {
  expandMainObjectTree,
  toggleObjectsTree,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  expandMeshComponentType,
  getModelComponentsObjectTree,
  openModelComponentContextMenu,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
  toggleModelTreeRow,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import {
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  viewerContextMenu,
} from "@vease_tests/utils/viewer_interaction";
import { applyAttribute } from "@vease_tests/utils/data/helpers/attribute";
import { hideObjectInTree } from "@vease_tests/utils/object_trees/common";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { rotateCamera } from "@vease_tests/utils/camera_interaction";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const brepFilename = "test.og_brep";
const vertexAttributeName = "test_vertex";
const polygonAttributeName = "test_polygon";
const ROTATE_LEFT_A_LITTLE = -180;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep and open model components", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await hideObjectInTree(window, "Blocks", undefined, getModelComponentsObjectTree(window));
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
});

test("surfaces visibility", async ({ window }) => {
  await closeAllMenus(window);
  await toggleModelTreeRow(window, "Surfaces");
});

test("surfaces color", async ({ window }) => {
  await toggleModelTreeRow(window, "Surfaces");
  await setModelTreeRowColorRandom(window, "Surfaces");
});

test("surfaces copy color to clipboard", async ({ window }) => {
  await copyModelPolygonsColor(window);
});

test("surfaces set color via input", async ({ window }) => {
  await setModelPolygonsColorInput(window, "0, 255, 0");
});

test("surfaces paste color in input", async ({ window }) => {
  await pasteModelPolygonsColorInput(window);
});

test("surfaces vertex attribute all surfaces", async ({ window }) => {
  await expandMeshComponentType(window, "Surfaces");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolygonsVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
});

test("surfaces vertex attribute unmapped elements color", async ({ window }) => {
  await setModelPolygonsVertexAttributeNoDataColor(window);
});

test("surfaces vertex attribute all surfaces change item", async ({ window }) => {
  await setModelPolygonsVertexAttribute(window, vertexAttributeName, { item: 1 });
  await moveMouseOutOfTheWay(window);
});

test("toggle object tree main", async ({ window }) => {
  await toggleObjectsTree(window);
});

test("surfaces vertex attribute one surface ", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: vertexAttributeName,
    colorMap: "roma",
  });
  await rotateCamera(window, ROTATE_LEFT_A_LITTLE, 0);
  await moveMouseOutOfTheWay(window);
});

test("surfaces polygon attribute all surfaces", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolygonsPolygonAttribute(window, polygonAttributeName, { item: 2 });
  await moveMouseOutOfTheWay(window);
});

test("surfaces polygon attribute one surface", async ({ window }) => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: polygonAttributeType,
    attributeName: polygonAttributeName,
  });
  await moveMouseOutOfTheWay(window);
});

test("hide points in model tree", async ({ window }) => {
  await toggleModelTreeRow(window, "Surfaces");
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree
    .locator(".tree-row-wrapper", { hasText: "Surfaces" })
    .locator(".tree-item-label")
    .first()
    .click({ button: "right" });
  await setModelPointsVisibility(window, false);
});

test("context menu through non visible surface", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree
    .locator(".tree-row-wrapper", { hasText: "00000000-" })
    .nth(4)
    .locator(".mdi-eye-off-outline")
    .first()
    .click();
  await waitForActionSettled(window);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await getHybridViewerCanvasBoundingBox(hybridViewerCanvas);
  await viewerContextMenu(window, box.width / 2, box.height / 2);
  await setModelColor(window);
});
