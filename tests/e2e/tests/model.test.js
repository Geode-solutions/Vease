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
  modelViewerObjectType,
  structuralModelGeodeObjectType,
} from "@tests/utils/constants";
import {
  expandGeodeObjectType,
  expandMainObjectTree,
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
import {
  setModelColor,
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelOpacity,
} from "@tests/utils/model/color.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { resetCamera } from "@tests/utils/camera_interaction";
import { setModelPolygonsVertexAttribute } from "@tests/utils/model/attribute.js";
import { test } from "@tests/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const structuralModelFilename = "test.og_strm";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load brep", async () => {
  await loadData(window, brepFilename);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, brepGeodeObjectType, defaultDataName);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549,
    y = 360;
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
  const mainObjectTree = window.getByTestId("mainObjectTree");
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

test("lines visibility", async () => {
  await toggleModelTreeRow(window, "Lines");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Lines");
});

test("lines color", async () => {
  await setModelTreeRowColorRandom(window, "Lines");
  await expect(window).toHaveScreenshot();
});

test("surfaces visibility", async () => {
  await toggleModelTreeRow(window, "Surfaces");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Surfaces");
});

test("surfaces color", async () => {
  await toggleModelTreeRow(window, "Surfaces");
  await setModelTreeRowColorRandom(window, "Surfaces");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Surfaces");
});

test("hide points in model tree", async () => {
  await window
    .getByTestId("modelComponentsObjectTree")
    .locator(".tree-row-wrapper", { hasText: "Surfaces" })
    .locator(".tree-item-label")
    .first()
    .click({ button: "right" });
  await setPointsVisibility(window, "model", false);
  await expect(window).toHaveScreenshot();
});

test("toggle object tree main", async () => {
  await toggleObjectsTree(window);
  await expect(window).toHaveScreenshot();
});

test("context menu through non visible surface", async () => {
  await window
    .getByTestId("modelComponentsObjectTree")
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
  await loadData(window, structuralModelFilename);
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

test("blocks vertex attribute", async () => {
  await openModelComponentContextMenu(window, "Blocks", 1);
  await setModelPolygonsVertexAttribute(window, "points", { colorMap: "implicit" });
  await expect(window).toHaveScreenshot();
});
