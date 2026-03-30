// Node imports
import { fileURLToPath } from "node:url";
import path from "node:path";

// Local imports
import { expect, test } from "./fixtures.js";
import { navigateToApp } from "./utils.js";

// Constants
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let _window = undefined;
let _cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  ({ window: _window, cleanup: _cleanup } = await navigateToApp(mode, page));
  await _window.waitForFunction(() => document.readyState === "complete");
});

test.afterAll(async () => {
  await _cleanup();
});

test("Microservices running", async () => {
  await expect(_window).toHaveScreenshot();
});

test("Load data", async () => {
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
