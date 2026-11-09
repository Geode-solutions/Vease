// Node imports

// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  brepGeodeObjectType,
  defaultDataName,
  polygonalSurfaceGeodeObjectType,
} from "@geode/opengeodeweb-front/tests/browser/helpers/constants.js";
import {
  closeAllMenus,
  moveMouseOutOfTheWay,
} from "@geode/opengeodeweb-front/tests/browser/helpers/app_interaction.js";
import { confirmAssign, openCrsByButton, selectCrs } from "@vease_tests/utils/crs";
import {
  expandMainObjectTree,
  openDataContextMenu,
} from "@geode/opengeodeweb-front/tests/browser/helpers/object_trees/main_object_tree.js";
import { exportProject, importProject } from "@vease_tests/utils/project_interaction";
import {
  getModelComponentsObjectTree,
  openModelComponentsTree,
  toggleModelTreeRow,
} from "@geode/opengeodeweb-front/tests/browser/helpers/object_trees/model_components_object_tree.js";
import { navigateToDataManagerPage, navigateToViewerPage } from "@vease_tests/utils/navigate";
import {
  setMeshEdgesColor,
  setMeshEdgesWidth,
  setMeshPolygonsVertexAttribute,
} from "@geode/opengeodeweb-front/tests/browser/helpers/data/index.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const meshFilename = "test.og_psf3d";
const brepFilename = "test.og_brep";
const vertexAttributeName = "test_vertex";
const modifiedVertexAttributeName = "test_vertex2";
const colorMapName = "vikO";
const LAMBERT_93 = "RGF93 v1 / Lambert-93";
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

// The project crs is saved with the project
test("assign a crs to the model", async ({ window }) => {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, brepGeodeObjectType);
  await selectCrs(window, LAMBERT_93);
  await confirmAssign(window);
  await navigateToViewerPage(window);
  await moveMouseOutOfTheWay(window);
  await expect(window.getByTestId("projectCrs")).toContainText("EPSG:2154");
});

test("export project", async ({ window, app }, testInfo) => {
  exportedProjectPath = testInfo.outputPath("project.vease");
  await exportProject(window, exportedProjectPath, app.electronApp);
});

// Each import runs in a freshly relaunched app, so what is displayed afterwards comes from the project file
test("import exported project", async ({ restartApp }) => {
  test.setTimeout(beforeAllTimeout);
  const window = await restartApp();
  await importProject(window, exportedProjectPath);
  await moveMouseOutOfTheWay(window);
  await expect(window.getByTestId("projectCrs")).toContainText("EPSG:2154");
});

// The app was restarted by the previous test: the window fixture still points to the closed page
test("modify imported project", async ({ app }) => {
  const { window } = app;
  await openMeshMenu(window);
  await setMeshPolygonsVertexAttribute(window, modifiedVertexAttributeName);
  await openMeshMenu(window);
  await setMeshEdgesWidth(window, modifiedEdgesWidth);
  await toggleModelCorners(window);
});

test("export modified project", async ({ app }, testInfo) => {
  const { window } = app;
  modifiedProjectPath = testInfo.outputPath("modified_project.vease");
  await exportProject(window, modifiedProjectPath, app.electronApp);
});

test("import modified project", async ({ restartApp }) => {
  test.setTimeout(beforeAllTimeout);
  const window = await restartApp();
  await importProject(window, modifiedProjectPath);
  await moveMouseOutOfTheWay(window);
});
