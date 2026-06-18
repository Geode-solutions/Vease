import {
  beforeAllTimeout,
  hideObjectInTree,
  loadData,
  navigateToApp,
} from "@tests/utils/viewer_interaction.js";
import { exportProject, importProject } from "@tests/utils/project_interaction.js";
import { expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { test } from "@tests/fixtures.js";

const inputFilename = "test.og_pts3d";
let window = undefined;
let cleanup = undefined;
let exportedFilePath = undefined;

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

test("load", async () => {
  await loadData(window, inputFilename);
  await expect(window).toHaveScreenshot("initial-state.png");
});

test("export project", async () => {
  const downloadDir = path.join(import.meta.dirname, "..", "tests", "data");
  exportedFilePath = await exportProject(window, downloadDir);
  expect(fs.existsSync(exportedFilePath)).toBe(true);
  expect(fs.statSync(exportedFilePath).size).toBeGreaterThan(0);
});

test("import project and restore visibility", async () => {
  await hideObjectInTree(window, "test");
  await expect(window).toHaveScreenshot("modified-state.png");
  await importProject(window, exportedFilePath);
  await expect(window).toHaveScreenshot("initial-state.png");
});

test("import project on reload", async () => {
  await window.reload();
  await window.waitForFunction(() => document.readyState === "complete");
  const appLoadWait = 8000;
  await window.waitForTimeout(appLoadWait);
  await importProject(window, exportedFilePath);
  await expect(window).toHaveScreenshot("initial-state.png");
});
