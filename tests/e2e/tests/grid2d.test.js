// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { beforeAllTimeout, loadData, navigateToApp } from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_rgd2d";
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
  await loadData(_window, inputFilename);
  await expect(_window).toHaveScreenshot();
});
