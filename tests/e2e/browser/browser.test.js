import { expect, test } from "@playwright/test";
import { isWindows } from "std-env";

test("Window title", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page).toHaveTitle("Vease");
});

test("Microservices running", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForTimeout((isWindows ? 30 : 10) * 1000);
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
});
