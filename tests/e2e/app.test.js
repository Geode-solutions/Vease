// Local imports
import { expect, test } from "./fixtures.js";
import { navigateToApp } from "./utils.js";

// Constants
let _window = undefined;
let _cleanup = undefined;

test.beforeEach(async ({ mode, page }) => {
  ({ window: _window, cleanup: _cleanup } = await navigateToApp(mode, page));
});

test.afterEach(async () => {
  await _cleanup();
});

test("Microservices running", async () => {
  await expect(_window).toHaveScreenshot({
    path: `microservices-running.png`,
  });
});
