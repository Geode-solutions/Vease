// Node imports
import path from "node:path";

// Third party imports

// Local imports
import {
  afterActionWait,
  moveMouseOutOfTheWay,
} from "@tests/utils/viewer_interaction.js";
import { exportProject, importProject } from "@tests/utils/project_interaction.js";
import { getMainObjectTree, getModelComponentsObjectTree, hideObjectInTree } from "@tests/utils/object_tree_interaction.js";
import { setColor } from "@tests/utils/helpers/color.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const inputFilename = "test_project.vease";

test.describe.configure({ mode: "serial" });

test("import project", async ({ window }) => {
  const projectFilePath = path.join(import.meta.dirname, "data", inputFilename);
  await importProject(window, projectFilePath);

});

test("toggle surfaces visibility", async ({ window }) => {
  await hideObjectInTree(window, "Surfaces", undefined, "modelComponentsObjectTree");

});

test("change lines color", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const item = modelComponentsObjectTree.getByText("Lines").first();
  await item.click({ button: "right" });
  await window.waitForTimeout(afterActionWait);

  const container = window.locator(".options-section", { hasText: "Lines Options" });
  await setColor(window, "modelStyleMenu", container);
  await moveMouseOutOfTheWay(window);

  await window.keyboard.press("Escape");
});

test("collapse model tree in main tree", async ({ window }) => {
  const mainObjectTree = getMainObjectTree(window);
  await mainObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "surface_cube" })
    .first()
    .locator("button:has(.mdi-magnify-expand)")
    .click({ force: true });
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);

});

test("export project", async ({ window }) => {
  await exportProject(window);
  await window.waitForTimeout(afterActionWait);

  await window.keyboard.press("Escape");
});
