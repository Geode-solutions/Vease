// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { beforeAllTimeout, brepGeodeObjectType } from "#ogw_e2e/constants.js";
import {
  expandPhysicalProperties,
  getPhysicalPropertiesObjectTree,
  getPhysicalPropertyColoringButton,
  getPhysicalValue,
  openPhysicalPropertiesTree,
  togglePhysicalPropertyColoring,
} from "#ogw_e2e/object_trees/physical_properties.js";
import { exportProject, importProject } from "@vease_tests/utils/project_interaction";
import {
  openModelComponentsTree,
  toggleModelTreeRow,
} from "#ogw_e2e/object_trees/model_components_object_tree.js";
import { loadOgwTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import { resetCamera } from "#ogw_e2e/camera_interaction.js";
import { test } from "@vease_tests/utils/fixtures";

// Constants
// The cube of OpenGeodeWeb-Front's test.og_brep with a porosity from 0.1 on its left to 0.3 on its right
const brepFilename = "test_physical_properties.og_brep";
// Start of the data name, still shown once the label is truncated in the middle
const dataName = "test_ph";
const blockId = "00000000-4335-411d-8000-000079b34fe5";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

// The exported project file is shared between the serial tests below
let exportedProjectPath = "";

test("load a brep with physical properties", async ({ window }) => {
  await loadOgwTestDatas(window, [brepFilename]);
  await resetCamera(window);
});

test("color the block by its porosity from the physical properties tree", async ({ window }) => {
  await openModelComponentsTree(window, brepGeodeObjectType, dataName);
  // The Surfaces hide the Block
  await toggleModelTreeRow(window, "Surfaces");
  await openPhysicalPropertiesTree(window, brepGeodeObjectType, dataName);
  await expandPhysicalProperties(window, ["porosity"]);
  await togglePhysicalPropertyColoring(window, "porosity");
  await expect(getPhysicalValue(window, blockId)).toHaveText("0.1 – 0.3");
});

test("export project", async ({ window, electronApp }, testInfo) => {
  exportedProjectPath = testInfo.outputPath("project.vease");
  await exportProject(window, exportedProjectPath, electronApp);
});

// The import runs in a freshly relaunched app: the physical properties tree, its opened property and the porosity
// Coloring come from the project file, the physical properties are read again from the back
test("import exported project", async ({ restartApp }) => {
  test.setTimeout(beforeAllTimeout);
  const window = await restartApp();
  await importProject(window, exportedProjectPath);
  await moveMouseOutOfTheWay(window);
  await expect(getPhysicalPropertiesObjectTree(window)).toBeVisible();
  await expect(getPhysicalValue(window, blockId)).toHaveText("0.1 – 0.3");
  await expect(
    getPhysicalPropertyColoringButton(window, "porosity").locator(".ph-fill"),
  ).toHaveCount(1);
});
