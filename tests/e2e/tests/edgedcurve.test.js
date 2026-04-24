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
  console.log("Right click on the EdgedCurve from viewer");
  await _window.locator("canvas").click({
    button: "right",
    position: {
      x: 442,
      y: 330
    }
  });
  await _window.waitForTimeout(waitAfterActionRender);
  await expect(_window).toHaveScreenshot();
});
await page.getByTestId('hybridViewer').locator('canvas').click({
  position: {
    x: 537,
    y: 430
  }
});
await page.getByTestId('hybridViewer').locator('canvas').click({
  position: {
    x: 555,
    y: 402
  }
});
await page.getByTestId('hybridViewer').locator('canvas').click({
  position: {
    x: 362,
    y: 273
  }
});
await page.getByTestId('hybridViewer').locator('canvas').click({
  position: {
    x: 362,
    y: 273
  }
});

// test("points visibility", async () => {
//   const meshPointsMenuButton = await _window.getByTestId("meshPointsMenu");
//   console.log("Toggle EdgedCurve points visibility", meshPointsMenuButton);
//   await meshPointsMenuButton.click();
//   const meshPointsVisibilitySwitch = await _window
//     .getByTestId("meshPointsVisibilitySwitch")
//     .getByRole("checkbox");
//   await meshPointsVisibilitySwitch.uncheck();
//   await _window.waitForTimeout(waitAfterActionRender);
//   await expect(_window).toHaveScreenshot();
// });

// test("points size", async () => {
//   const meshPointsSizeSlider = await _window
//     .getByTestId("meshPointsSizeSlider")
//     .getByRole("slider");
//   const toDrag = 10;
//   await meshPointsSizeSlider.dragTo(toDrag);
//   await _window.waitForTimeout(waitAfterActionRender);
//   await expect(_window).toHaveScreenshot();
// });

// test("object tree context menu", async () => {
//   console.log("Right click on the EdgedCurve from object tree");
//   const mainObjectTree = _window.getByTestId("mainObjectTree");
//   const BRepRow = mainObjectTree.locator("#v-list-group--id-BRep");
//   await BRepRow.locator(".v-list-item-action").first().getByRole("button").click();
//   await mainObjectTree.getByText("cube").click({
//     button: "right",
//     position: {
//       x: 10,
//       y: 10,
//     },
//   });
//   await _window.waitForTimeout(waitAfterActionRender);
//   await expect(_window).toHaveScreenshot();
// });

