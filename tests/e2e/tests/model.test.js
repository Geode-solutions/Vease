// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  loadData,
  navigateToApp,
  pointsMenuClick,
  setPointsSize,
  setPointsVisibility,
  vertexAttribute,
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
  await setPointsVisibility(window, "model", false);
  await vertexAttribute(window, "modelStyleMenu");
  await expect(window).toHaveScreenshot();
  await window.getByTestId("modelStyleMenu").click();
  await window.waitForTimeout(afterActionWait);
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

  await BlocksRow.locator("button:has([class*='mdi-eye'])").first().click();
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
    await surfaceLeafRows.nth(i).locator("button:has([class*='mdi-eye'])").first().click({ force: true });
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
  await row.locator("button:has([class*='mdi-eye'])").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function setModelTreeRowColorRandom(window, rowName) {
  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree.locator(".tree-row-wrapper").filter({ hasText: rowName });
  const label = row.locator('.tree-item-label').first();
  const box = await label.boundingBox();
  await label.dispatchEvent("contextmenu", {
    button: 2,
    clientX: box.x + 10,
    clientY: box.y + 10,
  });
  await window.waitForTimeout(afterActionWait);
  const styleMenu = await window.getByTestId("modelStyleMenu");
  await styleMenu.click();
  await window.waitForTimeout(afterActionWait);
  const select = await window.getByTestId('coloringStyleSelector');
  await select.click();
  await window.getByRole('option', { name: 'Random color' }).click();
  await window.waitForTimeout(afterActionWait);
  await styleMenu.click();
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


test("edges width", async () => {
  await openFeatureMenu(window, "model", "Edges");
  await setFeatureVisibility(window, "model", "Edges", true);
  await setFeatureSizeOrWidth(window, "model", "Edges", 5);
  await expect(window).toHaveScreenshot();
  await openFeatureMenu(window, "model", "Edges");
  await window.waitForTimeout(afterActionWait);
});
