// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { beforeAllTimeout, loadData, navigateToApp } from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_pts3d";
let window = undefined;
let cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  ({ window, cleanup } = await navigateToApp(mode, page));
  await window.waitForFunction(() => document.readyState === "complete");
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expect(window).toHaveScreenshot();
});
