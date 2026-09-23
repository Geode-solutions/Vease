// Node imports
import path from "node:path";

// Third party imports

// Local imports
import { exportProject, importProject } from "@tests/utils/project_interaction";
import {
  getModelComponentsObjectTree,
  openModelComponentsTree,
} from "@tests/utils/object_trees/model_components_object_tree";
import { moveMouseOutOfTheWay, waitForActionSettled } from "@tests/utils/viewer_interaction";
import { brepGeodeObjectType } from "@tests/utils/constants";
import { hideObjectInTree } from "@tests/utils/object_trees/common";
import { setColor } from "@tests/utils/data/helpers/color";
import { test } from "@tests/utils/fixtures";

// Constants
const inputFilename = "test_project.vease";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("import project", async ({ window }) => {
  const projectFilePath = path.join(import.meta.dirname, "data", inputFilename);
  await importProject(window, projectFilePath);
});

test("toggle surfaces visibility", async ({ window }) => {
  await hideObjectInTree(window, "Surfaces", undefined, getModelComponentsObjectTree(window));
});

test("change lines color", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const item = modelComponentsObjectTree.getByText("Lines", { exact: true }).first();
  await item.click({ button: "right" });
  await waitForActionSettled(window);

  const container = window.locator(".options-section", { hasText: "Lines Options" });
  await setColor(window, "modelStyleMenu", container);
  await moveMouseOutOfTheWay(window);
});

test("collapse model tree in main tree", async ({ window }) => {
  await window.keyboard.press("Escape");
  await openModelComponentsTree(window, brepGeodeObjectType, "surface_cube");
});

test("export project", async ({ window }) => {
  await exportProject(window);
  await waitForActionSettled(window);
});
