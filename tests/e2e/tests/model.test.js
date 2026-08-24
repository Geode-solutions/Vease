// oxlint-disable max-lines
// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
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
  setModelPolyhedraVertexAttribute,
} from "@tests/utils/data/model/attribute.js";
import { applyAttribute } from "@tests/utils/helpers/attribute.js";
import { loadDatas } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { test } from "@tests/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const structuralModelFilename = "test.og_strm";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const ROTATE_LEFT_A_LITTLE = -180;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load brep", async () => {
  await loadDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, brepGeodeObjectType, defaultDataName);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("info card", async () => {
  await toggleInfoCard(window);
  await expect(window).toHaveScreenshot();
  await toggleInfoCard(window);
});

test("points visibility", async () => {
  const visibility = true;
  await setPointsVisibility(window, modelViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, "model", POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("color", async () => {
  await setModelColorWithSlider(window);
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await setModelOpacity(window, OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("random coloring", async () => {
  await setModelColoringStyle(window, "Random");
  await expect(window).toHaveScreenshot();
});

test("object tree context menu", async () => {
  console.log("Right click on the BRep from object tree");
  await expandGeodeObjectType(window, "BRep");
  const mainObjectTree = getMainObjectTree(window);
  const testItem = mainObjectTree.getByText("test").first();
  await testItem.click({ button: "right", force: true });
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  await setEdgesVisibility(window, "model", true);
  await expect(window).toHaveScreenshot();
});

test("object tree model components", async () => {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await hideObjectInTree(window, "Blocks", undefined, "modelComponentsObjectTree");
  await hideAllComponentLeafRows(window, "Surfaces");
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("object tree hover lines", async () => {
  await hoverModelComponentRow(window, "Lines");
  await expect(window).toHaveScreenshot();
});

test("object tree hover first surface", async () => {
  await hoverModelComponentRow(window, "Surfaces", "00000000-");
  await expect(window).toHaveScreenshot();
});

test("blocks visibility", async () => {
  await toggleModelTreeRow(window, "Blocks");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Blocks");
});

test("blocks color", async () => {
  await toggleModelTreeRow(window, "Blocks");
  await setModelTreeRowColorRandom(window, "Blocks");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Blocks");
});

test("corners visibility", async () => {
  await toggleModelTreeRow(window, "Corners");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Corners");
});

test("corners color", async () => {
  await setModelTreeRowColorRandom(window, "Corners");
  await expect(window).toHaveScreenshot();
});

test("corners vertex attribute all corners", async () => {
  await expandGeodeObjectType(window, "Corners", "modelComponentsObjectTree");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPointsVertexAttribute(window, "points", { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("corners vertex attribute all corners change item", async () => {
  await setModelPointsVertexAttribute(window, "points", { item: 1 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("corners vertex attribute one corner", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: "unique vertices",
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("lines visibility", async () => {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await collapseGeodeObjectType(window, "Corners", "modelComponentsObjectTree");
  await toggleModelTreeRow(window, "Lines");
  await expect(window).toHaveScreenshot();
});

test("lines color", async () => {
  await toggleModelTreeRow(window, "Lines");
  await setModelTreeRowColorRandom(window, "Lines");
  await expect(window).toHaveScreenshot();
});

test("lines vertex attribute all lines", async () => {
  await expandGeodeObjectType(window, "Lines", "modelComponentsObjectTree");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelEdgesVertexAttribute(window, "points", { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("lines vertex attribute all lines change item", async () => {
  await setModelEdgesVertexAttribute(window, "points", { item: 1 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("lines vertex attribute one line", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: "unique vertices",
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("lines edge attribute all lines", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelEdgesEdgeAttribute(window, "edges", { item: 0 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("lines edge attribute one line", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: edgeAttributeType,
    attributeName: "edges",
    item: 0,
  });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("surfaces visibility", async () => {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await collapseGeodeObjectType(window, "Lines", "modelComponentsObjectTree");
  await toggleModelTreeRow(window, "Surfaces");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Surfaces");
});

test("surfaces color", async () => {
  await toggleModelTreeRow(window, "Surfaces");
  await setModelTreeRowColorRandom(window, "Surfaces");
  await expect(window).toHaveScreenshot();
});

test("surfaces vertex attribute all surfaces", async () => {
  await expandGeodeObjectType(window, "Surfaces", "modelComponentsObjectTree");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolygonsVertexAttribute(window, "points", { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("surfaces vertex attribute all surfaces change item", async () => {
  await setModelPolygonsVertexAttribute(window, "points", { item: 1 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("toggle object tree main", async () => {
  await toggleObjectsTree(window);
  await expect(window).toHaveScreenshot();
});

test("surfaces vertex attribute one surface ", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: "unique vertices",
    colorMap: "roma",
  });
  await rotateCamera(window, ROTATE_LEFT_A_LITTLE, 0);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("surfaces polygon attribute all surfaces", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelPolygonsPolygonAttribute(window, "triangle_vertices", { item: 2 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("surfaces polygon attribute one surface", async () => {
  await openModelComponentContextMenu(window, "00000000-", 0);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: polygonAttributeType,
    attributeName: "triangle_adjacents",
  });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("hide points in model tree", async () => {
  await toggleModelTreeRow(window, "Surfaces");
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree
    .locator(".tree-row-wrapper", { hasText: "Surfaces" })
    .locator(".tree-item-label")
    .first()
    .click({ button: "right" });
  await setPointsVisibility(window, "model", false);
  await expect(window).toHaveScreenshot();
});

test("context menu through non visible surface", async () => {
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

  await expect(window).toHaveScreenshot();
});

test("load structural model", async () => {
  await toggleObjectsTree(window);
  await loadDatas(window, [structuralModelFilename]);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("toggle both model component trees", async () => {
  await hideObjectInTree(window, "BRep");
  await resetCamera(window);
  await openModelComponentsTree(window, structuralModelGeodeObjectType, defaultDataName);
  await resetCamera(window);
  await toggleObjectsTree(window);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("blocks vertex attribute all blocks", async () => {
  await toggleModelTreeRow(window, "Surfaces", 0, 1);
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const secondModelTree = modelComponentsObjectTree.nth(1);
  await expandGeodeObjectType(window, "Blocks", secondModelTree);
  await openModelComponentContextMenu(window, "019ea699-", 0, 1);
  await setModelPolyhedraVertexAttribute(window, "points", { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("blocks vertex attribute all blocks change item", async () => {
  await setModelPolyhedraVertexAttribute(window, "points", { item: 1 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("blocks vertex attribute one block", async () => {
  await openModelComponentContextMenu(window, "019ea699-", 3, 1);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: vertexAttributeType,
    attributeName: "unique vertices",
    colorMap: "roma",
  });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("blocks polyhedron attribute all blocks", async () => {
  await openModelComponentContextMenu(window, "019ea699-", 0, 1);
  await setModelPolyhedraPolyhedronAttribute(window, "tetrahedron_vertices", { item: 2 });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("blocks polyhedron attribute one block", async () => {
  await openModelComponentContextMenu(window, "019ea699-", 3, 1);
  const componentOptions = window.getByTestId("modelComponentOptions");
  await applyAttribute(window, componentOptions, {
    attributeType: polyhedronAttributeType,
    attributeName: "tetrahedron_adjacents",
  });
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const secondModelTree = modelComponentsObjectTree.nth(1);
  await collapseGeodeObjectType(window, "Blocks", secondModelTree);
});
