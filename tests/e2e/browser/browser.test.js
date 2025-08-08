// Standard imports

// Third party imports
import { expect, test } from "@playwright/test";
import { isWindows } from "std-env";

// Local imports
import { run_browser } from "../../../utils/local.js";
var NUXT_PORT;
function getLogs(page) {
  page.on("console", (msg) => {
    console.log(`PAGE LOG: "${msg.text()}"`);
  });
}

test.beforeAll(async () => {
  NUXT_PORT = await run_browser(`test:browser`);
  console.log("NUXT_PORT", NUXT_PORT);
});

test.beforeEach(async ({ page }) => {
  getLogs(page);
  await page.goto(`http://localhost:${NUXT_PORT}/`);
  await page.setViewportSize({ width: 1200, height: 800 });
});

test("Window title", async ({ page }) => {
  await expect(page).toHaveTitle("Vease");
});

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout((isWindows ? 15 : 10) * 1000);
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
});
