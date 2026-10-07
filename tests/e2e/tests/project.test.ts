// Node imports

// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  brepGeodeObjectType,
  defaultDataName,
  polygonalSurfaceGeodeObjectType,
} from "@vease_tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  expandMainObjectTree,
  openDataContextMenu,
} from "@vease_tests/utils/object_trees/main_object_tree";
import { exportProject, importProject } from "@vease_tests/utils/project_interaction";
import {
  getModelComponentsObjectTree,
  openModelComponentsTree,
  toggleModelTreeRow,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import {
  setMeshEdgesColor,
  setMeshEdgesWidth,
  setMeshPolygonsVertexAttribute,
} from "@vease_tests/utils/data";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const meshFilename = "test.og_psf3d";
const brepFilename = "test.og_brep";
const vertexAttributeName = "test_vertex";
const modifiedVertexAttributeName = "test_vertex2";
const colorMapName = "vikO";
const edgesWidth = 5;
const modifiedEdgesWidth = 2;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

// Exported project files are shared between the serial tests below
let exportedProjectPath = "";
let modifiedProjectPath = "";

async function openMeshMenu(window: Page): Promise<void> {
  await closeAllMenus(window);
  await openDataContextMenu(window, polygonalSurfaceGeodeObjectType, defaultDataName);
}

async function toggleModelCorners(window: Page): Promise<void> {
  await closeAllMenus(window);
  if (!(await getModelComponentsObjectTree(window).first().isVisible())) {
    await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  }
  await toggleModelTreeRow(window, "Corners");
  await moveMouseOutOfTheWay(window);
}

test("load mesh and model", async ({ window }) => {
  await loadVeaseTestDatas(window, [meshFilename]);
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
});

test("mesh vertex attribute", async ({ window }) => {
  await openMeshMenu(window);
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName, { colorMap: colorMapName });
});

test("mesh edges color", async ({ window }) => {
  await openMeshMenu(window);
  await setMeshEdgesColor(window);
});

test("mesh edges width", async ({ window }) => {
  await openMeshMenu(window);
  await setMeshEdgesWidth(window, edgesWidth);
});

test("model corners visibility off", async ({ window }) => {
  await toggleModelCorners(window);
});

test("export project", async ({ window, app }, testInfo) => {
  exportedProjectPath = testInfo.outputPath("project.vease");
  await exportProject(window, exportedProjectPath, app.electronApp);
});

// Each import runs in a freshly relaunched app, so what is displayed afterwards comes from the project file
test("restart app before import", async ({ restartApp }) => {
  test.setTimeout(beforeAllTimeout);
  await restartApp();
});

test("import exported project", async ({ window }) => {
  await importProject(window, exportedProjectPath);
  await moveMouseOutOfTheWay(window);
});

test("modify imported project", async ({ window }) => {
  await openMeshMenu(window);
  await setMeshPolygonsVertexAttribute(window, modifiedVertexAttributeName);
  await openMeshMenu(window);
  await setMeshEdgesWidth(window, modifiedEdgesWidth);
  await toggleModelCorners(window);
});

test("export modified project", async ({ window, app }, testInfo) => {
  modifiedProjectPath = testInfo.outputPath("modified_project.vease");
  await exportProject(window, modifiedProjectPath, app.electronApp);
});

test("restart app before modified import", async ({ restartApp }) => {
  test.setTimeout(beforeAllTimeout);
  await restartApp();
});

test("import modified project", async ({ window }) => {
  await importProject(window, modifiedProjectPath);
  await moveMouseOutOfTheWay(window);
});
