// oxlint-disable max-lines
// oxlint-disable eslint/capitalized-comments
// oxlint-disable vitest/no-commented-out-tests
// Node imports

// Third party imports


// Local imports
import {
  afterActionWait,
  getHybridViewerCanvas,
  moveMouseOutOfTheWay,
  setEdgesVisibility,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  brepGeodeObjectType,
  defaultDataName,
  edgeAttributeType,
  modelViewerObjectType,
  polygonAttributeType,
  polyhedronAttributeType,
  structuralModelGeodeObjectType,
  vertexAttributeType,
} from "@tests/utils/constants";
import {
  collapseGeodeObjectType,
  expandGeodeObjectType,
  expandMainObjectTree,
  getMainObjectTree,
  getModelComponentsObjectTree,
  hideAllComponentLeafRows,
  hideObjectInTree,
  highlightData,
  hoverModelComponentRow,
  openModelComponentContextMenu,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
  toggleModelTreeRow,
  toggleObjectsTree,
} from "@tests/utils/object_tree_interaction.js";
import { resetCamera, rotateCamera } from "@tests/utils/camera_interaction";
import {
  setModelColor,
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelOpacity,
} from "@tests/utils/data/model/color.js";
import {
  setModelEdgesEdgeAttribute,
  setModelEdgesVertexAttribute,
  setModelPointsVertexAttribute,
  setModelPolygonsPolygonAttribute,
  setModelPolygonsVertexAttribute,
  setModelPolyhedraPolyhedronAttribute,
  // setModelPolyhedraVertexAttribute,
} from "@tests/utils/model/attribute.js";
import { applyAttribute } from "@tests/utils/helpers/attribute.js";
import { loadDatas } from "@tests/utils/load.js";

import { test } from "@tests/fixtures.js";

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

test.describe.configure({ mode: "serial" });

test("load brep", async ({ window }) => {
  await loadDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window }) => {
  await highlightData(window, brepGeodeObjectType, defaultDataName);
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
  const visibility = true;
  await setPointsVisibility(window, modelViewerObjectType, visibility);
});

test("points size", async ({ window }) => {
  await setPointsSize(window, "model", pointsSize);
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
  await window.waitForTimeout(afterActionWait);
});

test("edges visibility", async ({ window }) => {
  await setEdgesVisibility(window, "model", true);
});

test("object tree model components", async ({ window }) => {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await hideObjectInTree(window, "Blocks", undefined, "modelComponentsObjectTree");
  await hideAllComponentLeafRows(window, "Surfaces");
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
});

test("object tree hover lines", async ({ window }) => {
  await hoverModelComponentRow(window, "Lines");
});

test("object tree hover first surface", async ({ window }) => {
  await hoverModelComponentRow(window, "Surfaces", "00000000-");
});

test("blocks visibility", async ({ window }) => {
  await toggleModelTreeRow(window, "Blocks");
});

test("blocks color", async ({ window }) => {
  await toggleModelTreeRow(window, "Blocks");
  await toggleModelTreeRow(window, "Blocks");
  await setModelTreeRowColorRandom(window, "Blocks");
  await toggleModelTreeRow(window, "Blocks");
});

test("corners visibility", async ({ window }) => {
  await toggleModelTreeRow(window, "Corners");
});

test("corners color", async ({ window }) => {
  await toggleModelTreeRow(window, "Corners");
  await setModelTreeRowColorRandom(window, "Corners");
});

test("corners vertex attribute all corners", async ({ window }) => {
  await expandGeodeObjectType(window, "Corners", "modelComponentsObjectTree");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPointsVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
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
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await collapseGeodeObjectType(window, "Corners", "modelComponentsObjectTree");
  await toggleModelTreeRow(window, "Lines");
});

test("lines color", async ({ window }) => {
  await toggleModelTreeRow(window, "Lines");
  await setModelTreeRowColorRandom(window, "Lines");
});

test("lines vertex attribute all lines", async ({ window }) => {
  await expandGeodeObjectType(window, "Lines", "modelComponentsObjectTree");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelEdgesVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
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
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await collapseGeodeObjectType(window, "Lines", "modelComponentsObjectTree");
  await toggleModelTreeRow(window, "Surfaces");
});

test("surfaces color", async ({ window }) => {
  await toggleModelTreeRow(window, "Surfaces");
  await toggleModelTreeRow(window, "Surfaces");
  await setModelTreeRowColorRandom(window, "Surfaces");
});

test("surfaces vertex attribute all surfaces", async ({ window }) => {
  await expandGeodeObjectType(window, "Surfaces", "modelComponentsObjectTree");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolygonsVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
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
  await setPointsVisibility(window, "model", false);
});

test("context menu through non visible surface", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree
    .locator(".tree-row-wrapper", { hasText: "00000000-" })
    .nth(4)
    .locator(".mdi-eye-off-outline")
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  await viewerContextMenu(window, box.width / 2, box.height / 2);
  await setModelColor(window);
});

test("load structural model", async ({ window }) => {
  await toggleObjectsTree(window);
  await loadDatas(window, [structuralModelFilename]);
  await expandMainObjectTree(window);
});

test("toggle both model component trees", async ({ window }) => {
  await hideObjectInTree(window, "BRep");
  await resetCamera(window);
  await openModelComponentsTree(window, structuralModelGeodeObjectType, defaultDataName);
  await resetCamera(window);
  await toggleObjectsTree(window);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Surfaces", 0, 1);
});


test("blocks vertex attribute one block", async ({ window }) => {
  const secondModelTree = window.getByTestId("modelComponentsObjectTree").nth(1);
  await expandGeodeObjectType(window, "Blocks", secondModelTree);
  await openModelComponentContextMenu(window, "019ea699-", 3, 1);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: vertexAttributeName,
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
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
  await window.keyboard.press("Escape");
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const secondModelTree = modelComponentsObjectTree.nth(1);
  await collapseGeodeObjectType(window, "Blocks", secondModelTree);
});
