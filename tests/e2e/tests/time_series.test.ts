// Third party imports
import { brepGeodeObjectType, polygonalSurfaceGeodeObjectType } from "#ogw_e2e/constants.js";
import { closeAllMenus, moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import {
  closeModelComponentsTree,
  expandMeshComponentType,
  getModelComponentsObjectTree,
  openModelComponentTypeContextMenu,
  openModelComponentsTree,
} from "#ogw_e2e/object_trees/model_components_object_tree.js";
import {
  closeObjectsTree,
  expandMainObjectTree,
  getMainObjectTree,
  openObjectsTree,
} from "#ogw_e2e/object_trees/main_object_tree.js";
import { getQuickColormapPicker, viewerQuickColormap } from "#ogw_e2e/viewer_interaction.js";
import {
  removeThresholdFilter,
  selectThresholdSurfacePolygon,
  setThresholdMinimum,
  toggleThresholdFilter,
} from "#ogw_e2e/camera_interaction.js";
import {
  setMeshPolygonsTimeStep,
  setMeshPolygonsVertexAttribute,
  setModelEdgesEdgeAttribute,
  setModelPolygonsPolygonAttribute,
  setModelTimeStep,
} from "#ogw_e2e/data/index.js";
import { hideObjectInTree } from "#ogw_e2e/object_trees/common.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { setFeatureTimeStep } from "#ogw_e2e/data/helpers/attribute.js";
import { test } from "@vease_tests/utils/fixtures";

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
  await setFeatureTimeStep(window, getQuickColormapPicker(window), lastTimeStep);
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
});

test("model surfaces polygon time series", async ({ window }) => {
  await expandMeshComponentType(window, "Surfaces");
  await openModelComponentTypeContextMenu(window, "Surfaces");
  await setModelPolygonsPolygonAttribute(window, timeSeriesName);
});

test("model surfaces last time step", async ({ window }) => {
  await setModelTimeStep(window, surfacesLastTimeStep);
});

test("model lines edge time series starts at first time step", async ({ window }) => {
  await expandMeshComponentType(window, "Lines");
  await openModelComponentTypeContextMenu(window, "Lines");
  await setModelEdgesEdgeAttribute(window, timeSeriesName);
});

test("model lines time step", async ({ window }) => {
  await setModelTimeStep(window, linesTimeStep);
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
  await setModelTimeStep(window, surfacesFirstTimeStep);
});

test("model threshold remove", async ({ window }) => {
  await closeAllMenus(window);
  await toggleThresholdFilter(window);
  await removeThresholdFilter(window);
  await closeAllMenus(window);
  await moveMouseOutOfTheWay(window);
});

// The object trees cover the color bars: close them to click on the model one
test("model color bar time step", async ({ window }) => {
  await closeAllMenus(window);
  await closeModelComponentsTree(window, brepGeodeObjectType, modelDataName);
  await closeObjectsTree(window);
  await viewerQuickColormap(window);
  await setFeatureTimeStep(window, getQuickColormapPicker(window), middleTimeStep);
});
