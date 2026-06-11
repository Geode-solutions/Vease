// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  changeColor,
  changeOpacity,
  expandComponentsType,
  hideObjectInTree,
  highlightData,
  hoverModelComponentRow,
  loadData,
  navigateToApp,
  pointsVisibility,
  polyhedraAttribute,
  vertexAttribute,
  viewerContextMenu,

  featureVisibility,
  featureSizeOrWidth,
  featureTextures,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_brep";
const attributeName = "tetrahedron_vertices";
let window = undefined;
let cleanup = undefined;
const OFFSET = 10;
const OPACITY_50 = 50;
const geodeObjectType = "BRep";

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup?.();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, geodeObjectType);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549,
    y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("points visibility", async () => {
  const viewerObjectType = "model",
    visibility = true;
  await pointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});
    
test("points size", async () => {
  await featureSizeOrWidth(window, "model", "Points", 15);
  await expect(window).toHaveScreenshot();
});


test("vertex attribute", async () => {
  await pointsVisibility(window, "model", false);
  await vertexAttribute(window, "modelStyleMenu");
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await pointsVisibility(window, "model", false);
  await polyhedraAttribute(window, "modelStyleMenu", attributeName);
  await expect(window).toHaveScreenshot();
});

test("color", async () => {
  await changeColor(window, "modelStyleMenu");
  await expect(window).toHaveScreenshot();
});

test("opacity", async () => {
  await changeOpacity(window, "modelStyleMenu", OPACITY_50);
  await expect(window).toHaveScreenshot();
});

test("object tree context menu", async () => {
  console.log("Right click on the BRep from object tree");
  await expandComponentsType(window, "mainObjectTree", "BRep");
  const mainObjectTree = window.getByTestId("mainObjectTree");
  const testItem = mainObjectTree.getByText("test").first();
  const box = await testItem.boundingBox();
  await testItem.dispatchEvent("contextmenu", {
    button: 2,
    clientX: box.x + OFFSET,
    clientY: box.y + OFFSET,
  });
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  const brepEdgesMenuButton = await window.getByTestId("modelEdgesMenu");
  console.log("Toggle BRep edges visibility", brepEdgesMenuButton);
  await brepEdgesMenuButton.click();
  const modelEdgesVisibilitySwitch = await window
    .getByTestId("modelEdgesVisibilitySwitch")
    .getByRole("checkbox");
  console.log("Toggle BRep edges visibility", modelEdgesVisibilitySwitch);
  await modelEdgesVisibilitySwitch.check();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
});

test("object tree model components", async () => {
  const mainObjectTree = window.getByTestId("mainObjectTree");

  await mainObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "test" })
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await window.mouse.move(0, 0);
  await window.waitForTimeout(afterActionWait);

  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");

  await hideObjectInTree(window, "Blocks", "modelComponentsObjectTree");

  const SurfacesRow = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "Surfaces" });

  await SurfacesRow.locator(".mdi-menu-right").first().click();
  await window.waitForTimeout(afterActionWait);

  const surfaceLeafRows = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "00000000-" });

  const surfaceCount = await surfaceLeafRows.count();
  console.log(`Found ${surfaceCount} surface leaf rows to uncheck`);
  for (let i = 0; i < surfaceCount; i += 1) {
    console.log(`Unchecking surface ${i + 1}/${surfaceCount}`);
    // oxlint-disable-next-line no-await-in-loop
    await surfaceLeafRows.nth(i).locator(".mdi-eye").first().click({ force: true });
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(afterActionWait);
  }
  const importButton = await window.getByRole("button", { name: "Import" });
  await importButton.hover();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("object tree hover lines", async () => {
  await hoverModelComponentRow(window, "Lines");
  await expect(window).toHaveScreenshot();
});

test("object tree hover first surface", async () => {
  await hoverModelComponentRow(window, "00000000-");
  await expect(window).toHaveScreenshot();
});


async function toggleModelTreeRow(window, rowName) {
  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree.locator(".tree-row-wrapper").filter({ hasText: rowName }).first();
  await row.locator("button:has([class*='mdi-eye'])").first().click();
  await window.waitForTimeout(1500);
}

async function setModelTreeRowColorRandom(window, rowName) {
  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree.locator(".tree-row-wrapper").filter({ hasText: rowName }).first();
  const label = row.locator('.tree-item-label').first();
  const box = await label.boundingBox();
  await label.dispatchEvent("contextmenu", {
    button: 2,
    clientX: box.x + 10,
    clientY: box.y + 10,
  });
  await window.waitForTimeout(1500);
  
  await changeColor(window, "modelStyleMenu");
}

test("blocks visibility", async () => {
  await toggleModelTreeRow(window, "Blocks");
  await expect(window).toHaveScreenshot();
  await toggleModelTreeRow(window, "Blocks"); // revert
});

test("blocks color", async () => {
  await setModelTreeRowColorRandom(window, "Blocks");
  await expect(window).toHaveScreenshot();
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
  await setModelTreeRowColorRandom(window, "Surfaces");
  await expect(window).toHaveScreenshot();
});
