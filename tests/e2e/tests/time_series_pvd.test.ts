// oxlint-disable max-dependencies
// Node imports
import path from "node:path";

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  applyTimeSeries,
  loadVeaseTestDatas,
  selectTimeSeriesFile,
  selectTimeSeriesFolder,
  selectTimeSeriesTarget,
  uploadTimeSeriesFolder,
} from "@vease_tests/utils/load";
import { brepGeodeObjectType, defaultDataName } from "@vease_tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  expandMainObjectTree,
  getMainObjectTree,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  expandMeshComponentType,
  openModelComponentTypeContextMenu,
  openModelComponentsTree,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import { hideObjectInTree } from "@vease_tests/utils/object_trees/common";
import { setFeatureTimeStep } from "@vease_tests/utils/data/helpers/attribute";
import { setModelPolyhedraPolyhedronAttribute } from "@vease_tests/utils/data";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const __dirname = import.meta.dirname;
// Generated from cube.og_brep: the PVD references outputs/vtkOutput/..., three time steps
const dataPath = path.join(__dirname, "data", "cube_time_series");
const brepFilename = "cube.og_brep";
const otherBrepFilename = "test.og_brep";
const modelDataName = "cube";
const timeSeriesName = "pressure";
const lastTimeStep = 2;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename], { inputDataPath: dataPath });
  await expandMainObjectTree(window);
});

test("load another brep", async ({ window }) => {
  await loadVeaseTestDatas(window, [otherBrepFilename]);
});

test("import pvd file alone", async ({ window }) => {
  await selectTimeSeriesFile(window, path.join(dataPath, "cube_time_series.pvd"));
});

test("import pvd select target model", async ({ window }) => {
  // Both breps are compatible targets: the time series must go to the one it was generated from
  const targets = window.getByTestId("timeSeriesTarget");
  await expect(targets).toHaveCount(2);
  await expect(targets.filter({ hasText: defaultDataName })).toHaveCount(1);
  await selectTimeSeriesTarget(window, modelDataName);
});

test("import pvd select a folder above the referenced files", async ({ window }) => {
  // The whole data folder, which also holds the brep and the pvd: only the referenced files are kept
  await selectTimeSeriesFolder(window, dataPath);
});

test("import pvd upload referenced files", async ({ window }) => {
  await uploadTimeSeriesFolder(window);
});

test("import pvd apply on the existing model", async ({ window }) => {
  await applyTimeSeries(window);
  await expandMainObjectTree(window);
  // Applied on the selected model: no new data, the other brep is untouched
  const mainObjectTree = getMainObjectTree(window);
  await expect(mainObjectTree.getByText(modelDataName, { exact: true })).toHaveCount(1);
  await expect(mainObjectTree.getByText(defaultDataName, { exact: true })).toHaveCount(1);
});

test("blocks pressure time series", async ({ window }) => {
  await closeAllMenus(window);
  await hideObjectInTree(window, brepGeodeObjectType, defaultDataName, getMainObjectTree(window));
  await openModelComponentsTree(window, brepGeodeObjectType, modelDataName);
  await expandMeshComponentType(window, "Blocks");
  await openModelComponentTypeContextMenu(window, "Blocks");
  await setModelPolyhedraPolyhedronAttribute(window, timeSeriesName);
  await moveMouseOutOfTheWay(window);
});

test("blocks pressure last time step", async ({ window }) => {
  await setFeatureTimeStep(window, window.getByTestId("modelStyleMenu"), lastTimeStep);
});
