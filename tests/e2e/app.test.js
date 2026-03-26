// Third party imports
import kill from "kill-port";

import { expect, test } from "./fixtures.js"; // ← was "@playwright/test"
import { cleanupApp, navigateToApp } from "./utils.js";

// Local imports

// Constants

let nuxtPort = undefined;

test.beforeEach(async ({ page, mode }) => {
  console.log(`FROM TEST Testing app in ${mode} mode`);
  ({ nuxtPort } = await navigateToApp(page, mode));

  console.log("Navigated to TEST", { nuxtPort });
});

test.afterEach(async () => {
  console.log("Killing Nuxt process", { nuxtPort });
  await kill(nuxtPort);
  await cleanupApp();
  console.log("Killed Nuxt process", { nuxtPort });
});

test("Microservices running", async ({ page }) => {
  await expect(page).toHaveScreenshot({
    path: `microservices-running.png`,
  });
});
