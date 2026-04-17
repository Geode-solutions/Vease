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
const waitAfterAction = 2000;
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
  await _window.locator('canvas').click({
    button: 'right',
    position: {
      x: 583,
      y: 321
    }
  });
  await _window.waitForTimeout(waitAfterAction);
  await expect(_window).toHaveScreenshot();
});

test("BRep points visibility", async () => {
  const brepPointsMenuButton = await _window.getByTestId("modelPointsMenu");
  console.log("Toggle BRep points visibility", brepPointsMenuButton);
  await brepPointsMenuButton.click();
  const modelPointsVisibilitySwitch = await _window.getByTestId('modelPointsVisibilitySwitch').getByRole('checkbox')
  await modelPointsVisibilitySwitch.check();
  await _window.waitForTimeout(waitAfterAction);
  await expect(_window).toHaveScreenshot();
});

test("BRep edges visibility", async () => {
  const brepEdgesMenuButton = await _window.getByTestId("modelEdgesMenu")
  console.log("Toggle BRep edges visibility", brepEdgesMenuButton);
  await brepEdgesMenuButton.click();
  const modelEdgesVisibilitySwitch = await _window.getByTestId('modelEdgesVisibilitySwitch').getByRole('checkbox')
  console.log("Toggle BRep edges visibility", modelEdgesVisibilitySwitch);
  await modelEdgesVisibilitySwitch.check();
  await _window.waitForTimeout(waitAfterAction);
  await expect(_window).toHaveScreenshot();
});
