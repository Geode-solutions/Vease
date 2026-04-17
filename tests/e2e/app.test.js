// Node imports
import path from "node:path";

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { navigateToApp } from "./utils.js";
import { test } from "./fixtures.js";

// Constants
const __dirname = import.meta.dirname;
const beforeAllTimeout = 30_000;
const waitAfterActionRender = 1000;
let _window = undefined;
let _cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  console.log(`beforeAll Running tests in ${mode} mode`);
  const context = await browser.newContext();
  const page = await context.newPage();
  ({ window: _window, cleanup: _cleanup } = await navigateToApp(mode, page));
  await _window.waitForFunction(() => document.readyState === "complete");
}, beforeAllTimeout);

test.afterAll(async () => {
  await _cleanup();
});

test("Microservices running", async () => {
  await expect(_window).toHaveScreenshot();
});

test("Load BRep", async () => {
  const importButton = await _window.getByRole("button", { name: "Import" });
  await importButton.click();
  const fileInput = _window.locator('input[type="file"][accept*=".og_brep"]');
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(path.join(__dirname, "data", "cube.og_brep"));
  await _window.getByRole("main").getByRole("button", { name: "Import", exact: true }).click();
  const workflowTimeout = 7000;
  await _window.waitForTimeout(workflowTimeout);
  await expect(_window).toHaveScreenshot();
});

test("BRep context menu", async () => {
  console.log("Right click on the BRep");
  await _window.locator("canvas").click({
    button: "right",
    position: {
      x: 583,
      y: 321,
    },
  });
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});

test("BRep points visibility", async () => {
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

test("BRep edges visibility", async () => {
  const brepEdgesMenuButton = await _window.getByTestId("modelEdgesMenu");
  console.log("Toggle BRep edges visibility", brepEdgesMenuButton);
  await brepEdgesMenuButton.click();
  const modelEdgesVisibilitySwitch = await _window
    .getByTestId("modelEdgesVisibilitySwitch")
    .getByRole("checkbox");
  console.log("Toggle BRep edges visibility", modelEdgesVisibilitySwitch);
  await modelEdgesVisibilitySwitch.check();
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});

test("BRep object tree model components", async () => {
  const mainObjectTree = _window.getByTestId("mainObjectTree");
  const modelComponentsObjectTree = _window.getByTestId("modelComponentsObjectTree");

  const BRepRow = mainObjectTree.locator("#v-list-group--id-BRep");
  await BRepRow.locator(".v-list-item-action").first().getByRole("button").click();
  await _window.waitForTimeout(waitAfterActionRender);

  await mainObjectTree
    .locator('[role="option"]')
    .filter({ hasText: "cube" })
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await _window.waitForTimeout(waitAfterActionRender);

  const BlocksRow = modelComponentsObjectTree
    .locator('[role="option"]')
    .filter({ hasText: "Blocks" });

  await BlocksRow.locator('input[type="checkbox"]').uncheck();
  await _window.waitForTimeout(waitAfterActionRender);

  const SurfacesRow = modelComponentsObjectTree
    .locator('[role="option"]')
    .filter({ hasText: "Surfaces" });

  await SurfacesRow.locator(".v-list-item-action").first().getByRole("button").click();
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
      .locator('.v-list-item[role="option"]')
      .filter({ hasText: surfaceId })
      .first();
    // oxlint-disable-next-line no-await-in-loop
    await surfaceRow
      .locator('input[type="checkbox"]')
      .uncheck({ force: true });
    // oxlint-disable-next-line no-await-in-loop
    await _window.waitForTimeout(waitAfterActionRender);
  }
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});
