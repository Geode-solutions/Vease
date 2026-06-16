// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  changeColor,
  changeColoringStyle,
  changeOpacity,
  expandComponentsType,
  hideObjectInTree,
  highlightData,
  hoverModelComponentRow,
  loadData,
  navigateToApp,
  setPointsSize,
  setPointsVisibility,
  setPolyhedraAttribute,
  setVertexAttribute,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_brep";
const attributeName = "tetrahedron_vertices";
let window = undefined;
let cleanup = undefined;
const OPACITY_50 = 50;
const POINTS_SIZE = 15;
const geodeObjectType = "BRep";

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  if (typeof cleanup === "function") {await cleanup();}
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
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, "model", POINTS_SIZE);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, "model", false);
  await setVertexAttribute(window, "modelStyleMenu");
  await expect(window).toHaveScreenshot();
});

test("polyhedron attribute", async () => {
  await setPointsVisibility(window, "model", false);
  await setPolyhedraAttribute(window, "modelStyleMenu", attributeName);
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

test("random coloring", async () => {
  await changeColoringStyle(window, "modelStyleMenu", "Random");
  await expect(window).toHaveScreenshot();
});

test("object tree context menu", async () => {
  console.log("Right click on the BRep from object tree");
  await expandComponentsType(window, "mainObjectTree", "BRep");
  const mainObjectTree = window.getByTestId("mainObjectTree");
  const testItem = mainObjectTree.getByText("test").first();
  await testItem.click({ button: "right", force: true });
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

async function toggleModelTreeRow(appWindow, rowName) {
  const modelComponentsObjectTree = appWindow.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: rowName })
    .first();
  await row.locator("button:has([class*='mdi-eye'])").first().click();
  await appWindow.waitForTimeout(afterActionWait);
}

async function setModelTreeRowColorRandom(appWindow, rowName) {
  const modelComponentsObjectTree = appWindow.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: rowName })
    .first();
  const label = row.locator(".tree-item-label").first();
  await label.click({ button: "right", force: true });
  await appWindow.waitForTimeout(afterActionWait);

  await changeColor(appWindow, "modelStyleMenu");
  await appWindow.keyboard.press("Escape");
  await appWindow.waitForTimeout(afterActionWait);
}

test("blocks visibility", async () => {
  await toggleModelTreeRow(window, "Blocks");
  await expect(window).toHaveScreenshot();
  // Revert
  await toggleModelTreeRow(window, "Blocks");
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
