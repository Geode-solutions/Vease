// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { beforeAllTimeout, loadData, navigateToApp, viewerContextMenu } from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_psf3d";
let window = undefined;
let cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  await viewerContextMenu(window, 588, 324);
  await expect(window).toHaveScreenshot();
});
