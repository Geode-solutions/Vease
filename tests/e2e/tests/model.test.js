// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  loadData,
  navigateToApp,
<<<<<<< HEAD
  pointsMenuClick,
  setPointsSize,
  setPointsVisibility,
=======
  pointsVisibility,
  vertexAttribute,
>>>>>>> 5e02b942b808525db37b3051506ba246cee82ddd
  viewerContextMenu,
  openFeatureMenu,
  setFeatureVisibility,
  setFeatureSizeOrWidth,
  setFeatureColorRandom,
} from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_brep";
const viewerObjectType = "model";
let window = undefined;
let cleanup = undefined;
const OFFSET = 10;

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

test("viewer context menu", async () => {
  const x = 549,
    y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
  await window.mouse.click(0, 0); // close context menu
});

test("points visibility", async () => {
  const visibility = true;
  await setPointsVisibility(window, viewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  const size = 15;
  await setPointsSize(window, viewerObjectType, size);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await pointsVisibility(window, "model", false);
  await vertexAttribute(window, "modelStyleMenu");
  await expect(window).toHaveScreenshot();
});

test("object tree context menu", async () => {
  console.log("Right click on the BRep from object tree");
  const mainObjectTree = window.getByTestId("mainObjectTree");
  const BRepRow = mainObjectTree.locator(".tree-row-wrapper").filter({ hasText: "BRep" }).first();
  await BRepRow.locator(".mdi-menu-right").first().dispatchEvent("click");
  await window.waitForTimeout(afterActionWait);

  const testItem = mainObjectTree.getByText("test").first();
  const box = await testItem.boundingBox();
  await testItem.dispatchEvent("contextmenu", {
    button: 2,
    clientX: box.x + OFFSET,
    clientY: box.y + OFFSET,
  });
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
  await window.mouse.click(0, 0); // close context menu
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
  await brepEdgesMenuButton.click();
});

test("edges width", async () => {
  await openFeatureMenu(window, viewerObjectType, "Edges");
  await setFeatureVisibility(window, viewerObjectType, "Edges", true);
  await setFeatureSizeOrWidth(window, viewerObjectType, "Edges", 5);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, viewerObjectType, "Edges");
  await window.waitForTimeout(afterActionWait);
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

  const BlocksRow = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "Blocks" });

  await BlocksRow.locator(".mdi-eye").first().click();
  await window.waitForTimeout(afterActionWait);

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


async function toggleModelTreeRow(window, rowName) {
  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree.locator(".tree-row-wrapper").filter({ hasText: rowName });
  await row.locator(".mdi-eye").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function setModelTreeRowColorRandom(window, rowName) {
  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree.locator(".tree-row-wrapper").filter({ hasText: rowName });
  await row.click();
  await window.waitForTimeout(afterActionWait);
  const select = await window.getByLabel('Select a coloring style');
  await select.click();
  await window.getByRole('option', { name: 'Random color' }).click();
  await window.waitForTimeout(afterActionWait);
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

