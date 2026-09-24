// oxlint-disable max-lines
// oxlint-disable eslint/capitalized-comments
// oxlint-disable vitest/no-commented-out-tests
// Node imports

// Third party imports

// Local imports
import {
  brepGeodeObjectType,
  defaultDataName,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  structuralModelGeodeObjectType,
  vertexAttributeType,
} from "@tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@tests/utils/app_interaction";
import {
  collapseMeshComponentType,
  collapseModelComponentTypes,
  expandMeshComponentType,
  getModelComponentsObjectTree,
  hideAllComponentLeafRows,
  hoverLines,
  hoverSurfaces,
  openModelComponentContextMenu,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
  toggleModelTreeRow,
} from "@tests/utils/object_trees/model_components_object_tree";
import {
  copyModelEdgesColor,
  copyModelPointsColor,
  copyModelPolygonsColor,
  copyModelPolyhedraColor,
  pasteModelEdgesColorInput,
  pasteModelPointsColorInput,
  pasteModelPolygonsColorInput,
  pasteModelPolyhedraColorInput,
  setModelColor,
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelEdgesColorInput,
  setModelEdgesEdgeAttribute,
  setModelEdgesVertexAttribute,
  setModelEdgesVertexAttributeNoDataColor,
  setModelEdgesVisibility,
  setModelOpacity,
  setModelPointsColorInput,
  setModelPointsSize,
  setModelPointsVertexAttribute,
  setModelPointsVertexAttributeNoDataColor,
  setModelPointsVisibility,
  setModelPolygonsColorInput,
  setModelPolygonsPolygonAttribute,
  setModelPolygonsVertexAttribute,
  setModelPolygonsVertexAttributeNoDataColor,
  setModelPolyhedraColorInput,
  setModelPolyhedraPolyhedronAttribute,
  setModelPolyhedraVertexAttribute,
  setModelPolyhedraVertexAttributeNoDataColor,
} from "@tests/utils/data";
import {
  expandGeodeObjectType,
  expandMainObjectTree,
  getMainObjectTree,
  highlightData,
  toggleObjectsTree,
} from "@tests/utils/object_trees/main_object_tree";
import { expandGeodeObjectTypeInTree, hideObjectInTree } from "@tests/utils/object_trees/common";
import {
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  toggleInfoCard,
  viewerContextMenu,
  waitForActionSettled,
} from "@tests/utils/viewer_interaction";
import { resetCamera, rotateCamera } from "@tests/utils/camera_interaction";
import { applyAttribute } from "@tests/utils/data/helpers/attribute";
import { loadVeaseTestDatas } from "@tests/utils/load";
import { test } from "@tests/utils/fixtures";

// Constants
const brepFilename = "test.og_brep";
const structuralModelFilename = "test.og_strm";
const vertexAttributeName = "test_vertex";
const edgeAttributeName = "test_edge";
const polygonAttributeName = "test_polygon";
const polyhedronAttributeName = "test_polyhedron";
const modelOpacity = 50;
const pointsSize = 15;
const ROTATE_LEFT_A_LITTLE = -180;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window, screenshotMask }) => {
  await highlightData(window, brepGeodeObjectType, defaultDataName);
  screenshotMask.locators = [window.getByTestId("tooltipIdValue")];
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
  await setModelPointsVisibility(window, true);
});

test("points size", async ({ window }) => {
  await setModelPointsSize(window, pointsSize);
});

test("model color", async ({ window }) => {
  await setModelColorWithSlider(window);
});

test("model opacity", async ({ window }) => {
  await setModelOpacity(window, modelOpacity);
});

test("random coloring", async ({ window }) => {
  await setModelColoringStyle(window, "Random");
});

test("object tree context menu", async ({ window }) => {
  console.log("Right click on the BRep from object tree");
  await expandGeodeObjectType(window, "BRep");
  const mainObjectTree = getMainObjectTree(window);
  const testItem = mainObjectTree.getByText("test", { exact: true }).first();
  await testItem.click({ button: "right", force: true });
  await waitForActionSettled(window);
});

test("edges visibility", async ({ window }) => {
  await setModelEdgesVisibility(window, true);
});

test("object tree model components", async ({ window }) => {
  await closeAllMenus(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await hideObjectInTree(window, "Blocks", undefined, getModelComponentsObjectTree(window));
  await hideAllComponentLeafRows(window, "Surfaces");
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
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

test("corners visibility", async ({ window }) => {
  await closeAllMenus(window);
  await collapseMeshComponentType(window, "Blocks");
  await toggleModelTreeRow(window, "Blocks");
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

test("surfaces visibility", async ({ window }) => {
  await closeAllMenus(window);
  await collapseMeshComponentType(window, "Lines");
  await toggleModelTreeRow(window, "Surfaces");
});

test("surfaces color", async ({ window }) => {
  await toggleModelTreeRow(window, "Surfaces");
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

test("load structural model", async ({ window }) => {
  await toggleObjectsTree(window);
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
