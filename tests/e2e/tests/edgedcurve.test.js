// Node imports
import path from "node:path";

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { loadData, navigateToApp } from "@tests/utils.js";
import { test } from "@tests/fixtures.js";


// Constants
const __dirname = import.meta.dirname;
const inputFileExtension = ".og_edc3d";
const inputFilePath = path.join(__dirname, "data", `test${inputFileExtension}`);
const beforeAllTimeout = 30_000;
const waitAfterActionRender = 1000;
let _window = undefined;
let _cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  ({ window: _window, cleanup: _cleanup } = await navigateToApp(mode, page));
  await _window.waitForFunction(() => document.readyState === "complete");
}, beforeAllTimeout);

test.afterAll(async () => {
  await _cleanup();
});

test("load", async () => {
  await loadData(_window, inputFilePath, inputFileExtension);
  await expect(_window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  console.log("Right click on the BRep from viewer");
  await _window.locator("canvas").click({
    button: "right",
    position: {
      x: 635,
      y: 225
    }
  });
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});

test("points visibility", async () => {
  const brepPointsMenuButton = await _window.getByTestId("modelPointsMenu");
  console.log("Toggle BRep points visibility", brepPointsMenuButton);
  await brepPointsMenuButton.click();
  const modelPointsVisibilitySwitch = await _window
    .getByTestId("modelPointsVisibilitySwitch")
    .getByRole("checkbox");
  await modelPointsVisibilitySwitch.check();
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});

test("object tree context menu", async () => {
  console.log("Right click on the BRep from object tree");
  const mainObjectTree = _window.getByTestId("mainObjectTree");
  const BRepRow = mainObjectTree.locator("#v-list-group--id-BRep");
  await BRepRow.locator(".v-list-item-action").first().getByRole("button").click();
  await mainObjectTree.getByText("cube").click({
    button: "right",
    position: {
      x: 10,
      y: 10,
    },
  });
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});

test("edges visibility", async () => {
  const brepEdgesMenuButton = await _window.getByTestId("modelEdgesMenu");
  console.log("Toggle BRep edges visibility", brepEdgesMenuButton);
  await brepEdgesMenuButton.click();
  const modelEdgesVisibilitySwitch = await _window
    .getByTestId("modelEdgesVisibilitySwitch")
    .getByRole("checkbox");
  console.log("Toggle BRep edges visibility", modelEdgesVisibilitySwitch);
  await modelEdgesVisibilitySwitch.check();
  await _window.waitForTimeout(waitAfterActionRender);
  const viewer = _window.getByTestId("hybridViewer");
  const box = await viewer.boundingBox();
  await expect(_window).toHaveScreenshot({
    clip: box,
  });
  await _window.keyboard.press("Escape");
});

test("object tree model components", async () => {
  const mainObjectTree = _window.getByTestId("mainObjectTree");

  await mainObjectTree
    .locator('[role="treeitem"]')
    .filter({ hasText: "cube" })
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await _window.waitForTimeout(waitAfterActionRender);

  const modelComponentsObjectTree = _window.getByTestId("modelComponentsObjectTree");

  const BlocksRow = modelComponentsObjectTree
    .locator('[role="treeitem"]')
    .filter({ hasText: "Blocks" });

  await BlocksRow.locator('input[type="checkbox"]').uncheck();
  await _window.waitForTimeout(waitAfterActionRender);

  const SurfacesRow = modelComponentsObjectTree
    .locator('[role="treeitem"]')
    .filter({ hasText: "Surfaces" });

  await SurfacesRow.locator("button:has(.mdi-menu-right)").click();
  await _window.waitForTimeout(waitAfterActionRender);

  const surfaceIds = [
    "00000000-8afd-4969-8000-000092a43747",
    "00000000-1702-4d26-8000-000004d7ea39",
    "00000000-6732-4f29-8000-00002f66bc93",
    "00000000-cddf-4c1c-8000-00005ebbcaeb",
    "00000000-dc1c-420d-8000-000070dcfff5",
    "00000000-dcfe-400a-8000-0000a72c4f30",
  ];

  for (const surfaceId of surfaceIds) {
    console.log(`Unchecking surface: ${surfaceId}`);
    const surfaceRow = modelComponentsObjectTree
      .locator('[role="treeitem"]')
      .filter({ hasText: surfaceId })
      .first();
    // oxlint-disable-next-line no-await-in-loop
    await surfaceRow.locator('input[type="checkbox"]').uncheck({ force: true });
    // oxlint-disable-next-line no-await-in-loop
    await _window.waitForTimeout(waitAfterActionRender);
  }

  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});
