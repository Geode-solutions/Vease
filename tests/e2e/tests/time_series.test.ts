// oxlint-disable max-dependencies
// Third party imports
import { brepGeodeObjectType, polygonalSurfaceGeodeObjectType } from "@vease_tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  closeObjectsTree,
  expandMainObjectTree,
  getMainObjectTree,
  openObjectsTree,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  expandMeshComponentType,
  getModelComponentsObjectTree,
  openModelComponentTypeContextMenu,
  openModelComponentsTree,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import {
  removeThresholdFilter,
  selectThresholdSurfacePolygon,
  setThresholdMinimum,
  toggleThresholdFilter,
} from "@vease_tests/utils/camera_interaction";
import {
  setMeshPolygonsTimeStep,
  setMeshPolygonsVertexAttribute,
  setModelEdgesEdgeAttribute,
  setModelPolygonsPolygonAttribute,
} from "@vease_tests/utils/data";
import { hideObjectInTree } from "@vease_tests/utils/object_trees/common";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { setFeatureTimeStep } from "@vease_tests/utils/data/helpers/attribute";
import { test } from "@vease_tests/utils/fixtures";
import { viewerQuickColormap } from "@vease_tests/utils/viewer_interaction";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const inputFilename = "time_series.og_psf3d";
const meshDataName = "time_series";
const brepFilename = "model_time_series.og_brep";
const modelDataName = "model_time_series";
const timeSeriesName = "temperature";
const middleTimeStep = 1;
const lastTimeStep = 2;
const surfacesLastTimeStep = 2;
const linesTimeStep = 3;
const surfacesFirstTimeStep = 0;
// Surfaces values are 10 * time step + element index % 10: only part of the last step passes
const thresholdMinimum = 25;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  await loadVeaseTestDatas(window, [inputFilename]);
  await expandMainObjectTree(window);
});

test("time series vertex attribute", async ({ window }) => {
  await setMeshPolygonsVertexAttribute(window, timeSeriesName);
});

test("time series last time step", async ({ window }) => {
  await setMeshPolygonsTimeStep(window, lastTimeStep);
});

test("time series middle time step", async ({ window }) => {
  await setMeshPolygonsTimeStep(window, middleTimeStep);
});

test("time series color bar time step", async ({ window }) => {
  await closeAllMenus(window);
  await closeObjectsTree(window);
  await viewerQuickColormap(window);
  const quickColormapPicker = window
    .locator(".v-overlay__content")
    .filter({ has: window.getByTestId("colorMapListFilter") });
  await setFeatureTimeStep(window, quickColormapPicker, lastTimeStep);
});

test("model load brep and open model components", async ({ window }) => {
  await closeAllMenus(window);
  await openObjectsTree(window);
  await expandMainObjectTree(window);
  await hideObjectInTree(
    window,
    polygonalSurfaceGeodeObjectType,
    meshDataName,
    getMainObjectTree(window),
  );
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await openModelComponentsTree(window, brepGeodeObjectType, modelDataName);
  await hideObjectInTree(window, "Blocks", undefined, getModelComponentsObjectTree(window));
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
});

test("model surfaces polygon time series", async ({ window }) => {
  await expandMeshComponentType(window, "Surfaces");
  await openModelComponentTypeContextMenu(window, "Surfaces");
  await setModelPolygonsPolygonAttribute(window, timeSeriesName);
});

test("model surfaces last time step", async ({ window }) => {
  await setFeatureTimeStep(window, window.getByTestId("modelStyleMenu"), surfacesLastTimeStep);
});

test("model lines edge time series starts at first time step", async ({ window }) => {
  await expandMeshComponentType(window, "Lines");
  await openModelComponentTypeContextMenu(window, "Lines");
  await setModelEdgesEdgeAttribute(window, timeSeriesName);
});

test("model lines time step", async ({ window }) => {
  await setFeatureTimeStep(window, window.getByTestId("modelStyleMenu"), linesTimeStep);
});

test("model surfaces keep their time step", async ({ window }) => {
  await openModelComponentTypeContextMenu(window, "Surfaces");
  await moveMouseOutOfTheWay(window);
});

test("model threshold surfaces time series", async ({ window }) => {
  await closeAllMenus(window);
  await toggleThresholdFilter(window);
  await selectThresholdSurfacePolygon(window, modelDataName, timeSeriesName);
  await setThresholdMinimum(window, thresholdMinimum);
  await moveMouseOutOfTheWay(window);
});

test("model threshold follows the time step", async ({ window }) => {
  await openModelComponentTypeContextMenu(window, "Surfaces");
  await setFeatureTimeStep(window, window.getByTestId("modelStyleMenu"), surfacesFirstTimeStep);
});

test("model threshold remove", async ({ window }) => {
  await closeAllMenus(window);
  await toggleThresholdFilter(window);
  await removeThresholdFilter(window);
  await closeAllMenus(window);
  await moveMouseOutOfTheWay(window);
});
