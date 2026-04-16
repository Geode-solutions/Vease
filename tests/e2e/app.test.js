// Node imports
import path from "node:path";

// Third party imports
import { describe, expect } from "@playwright/test";

// Local imports
import { navigateToApp } from "./utils.js";
import { test } from "./fixtures.js";

// Constants
const __dirname = import.meta.dirname;
const beforeAllTimeout = 150;
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

test("Microservices running", async () => {
  await expect(_window).toHaveScreenshot();
});

describe("BRep workflow", () => {
  test("Load BRep", async () => {
    const importButton = await _window.getByRole("button", { name: "Import" });
    await importButton.click();
    const fileInput = _window.locator('input[type="file"][accept*=".og_brep"]');
    await fileInput.waitFor({ state: "attached" });
    await fileInput.setInputFiles(path.join(__dirname, "data", "cube.og_brep"));
    await _window.getByRole("main").getByRole("button", { name: "Import", exact: true }).click();
    const workflowTimeout = 5000;
    await _window.waitForTimeout(workflowTimeout);
    await expect(_window).toHaveScreenshot();
  });

  test("edges visibility", async () => {
    await page.locator('canvas').click({
      button: 'right',
      position: {
        x: 589,
        y: 325
      }
    });
    await page.locator('#v-menu-v-0-49').getByRole('button').nth(1).click();
    await page.locator('#v-menu-v-0-49').getByRole('button').nth(1).click();
    await page.locator('#v-menu-v-0-49').getByRole('button').first().click();
  });
});





