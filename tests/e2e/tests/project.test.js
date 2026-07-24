// Node imports
import path from "node:path";

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { afterActionWait, beforeAllTimeout } from "@tests/utils/viewer_interaction.js";
import { exportProject, importProject } from "@tests/utils/project_interaction.js";
import { hideObjectInTree } from "@tests/utils/object_tree_interaction.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setColor } from "@tests/utils/helpers/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test_project.vease";
let window = undefined;
let cleanup = undefined;
const OFFSET = 10;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("import project", async () => {
  const projectFilePath = path.join(import.meta.dirname, "data", inputFilename);
  await importProject(window, projectFilePath);
  await expect(window).toHaveScreenshot("imported-project.png");
});

test("toggle surfaces visibility", async () => {
  await hideObjectInTree(window, "Surfaces", undefined, "modelComponentsObjectTree");
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
  await setColor(window, "modelStyleMenu", container);
  await window.mouse.move(0, 0);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
});

test("collapse model tree in main tree", async () => {
  await window
    .getByTestId("mainObjectTree")
    .locator(".tree-row-wrapper")
    .filter({ hasText: "surface_cube" })
    .first()
    .locator("button:has(.mdi-magnify-expand)")
    .click({ force: true });
  await window.waitForTimeout(afterActionWait);
  await window.mouse.move(0, 0);
  await expect(window).toHaveScreenshot();
});

test("export project", async () => {
  await exportProject(window);
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
});
