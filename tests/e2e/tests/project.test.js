import {
  afterActionWait,
  beforeAllTimeout,
  changeColor,
  hideObjectInTree,
  navigateToApp,
} from "@tests/utils/viewer_interaction.js";
import { exportProject, importProject } from "@tests/utils/project_interaction.js";
import { expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { test } from "@tests/fixtures.js";

const inputFilename = "test_project.vease";
let window = undefined;
let cleanup = undefined;
let exportedFilePath = undefined;
const OFFSET = 10;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  if (exportedFilePath && fs.existsSync(exportedFilePath)) {
    try {
      fs.unlinkSync(exportedFilePath);
    } catch (error) {
      console.warn("Failed to delete temporary project file:", error);
    }
  }
  await cleanup();
});

test("import project", async () => {
  const projectFilePath = path.join(import.meta.dirname, "data", inputFilename);
  await importProject(window, projectFilePath);
  await expect(window).toHaveScreenshot("imported-project.png");
});

test("toggle surfaces visibility", async () => {
  await hideObjectInTree(window, "Surfaces", "modelComponentsObjectTree");
  await expect(window).toHaveScreenshot("hide-surfaces.png");
});

test("change lines color", async () => {
  const tree = window.getByTestId("modelComponentsObjectTree");
  const item = tree.getByText("Lines").first();
  const box = await item.boundingBox();
  await item.dispatchEvent("contextmenu", {
    button: 2,
    clientX: box.x + OFFSET,
    clientY: box.y + OFFSET,
  });
  await window.waitForTimeout(afterActionWait);

  const container = window.locator(".options-section", { hasText: "Lines Options" });
  await changeColor(window, "modelStyleMenu", container);
  await window.mouse.move(0, 0);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
});

test("collapse model tree in main tree", async () => {
  const mainObjectTree = window.getByTestId("mainObjectTree");
  await mainObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "surface_cube" })
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await window.waitForTimeout(afterActionWait);
  await window.mouse.move(0, 0);
  await expect(window).toHaveScreenshot();
});

test("export project", async () => {
  const downloadDir = path.join(import.meta.dirname, "data");
  exportedFilePath = await exportProject(window, downloadDir);
  expect(fs.existsSync(exportedFilePath)).toBe(true);
  expect(fs.statSync(exportedFilePath).size).toBeGreaterThan(0);
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});
