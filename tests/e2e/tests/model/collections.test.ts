// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { defaultDataName, structuralModelGeodeObjectType } from "#ogw_e2e/constants.js";
import {
  getModelComponentTypeTab,
  getModelComponentsObjectTree,
  openModelComponentContextMenu,
  openModelComponentsTree,
  toggleModelTreeRow,
} from "#ogw_e2e/object_trees/model_components_object_tree.js";
import {
  setModelColor,
  setModelColoringStyle,
  setModelPolygonsVertexAttribute,
  setModelSurfacesVisibility,
} from "#ogw_e2e/data/index.js";
import { expandGeodeObjectTypeInTree } from "#ogw_e2e/object_trees/common.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import { resetCamera } from "#ogw_e2e/camera_interaction.js";
import { test } from "@vease_tests/utils/fixtures";

// Constants
const structuralModelFilename = "test.og_strm";
const collectionTypeRowName = "ModelBoundaries";
const collectionRowName = "019ea684-373";
const vertexAttributeName = "test_vertex";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load structural model", async ({ window }) => {
  await loadVeaseTestDatas(window, [structuralModelFilename]);
  await resetCamera(window);
});

test("open collections tree", async ({ window }) => {
  await openModelComponentsTree(window, structuralModelGeodeObjectType, defaultDataName);
  await expandGeodeObjectTypeInTree(
    window,
    collectionTypeRowName,
    getModelComponentsObjectTree(window),
  );
  await moveMouseOutOfTheWay(window);
});

test("hide blocks", async ({ window }) => {
  await toggleModelTreeRow(window, "Blocks");
  await moveMouseOutOfTheWay(window);
});

test("collection type color", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionTypeRowName);
  await expect(getModelComponentTypeTab(window)).toHaveText("Surfaces");
  await setModelColor(window);
  await moveMouseOutOfTheWay(window);
});

test("collection visibility", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionRowName);
  await setModelSurfacesVisibility(window, false);
  await moveMouseOutOfTheWay(window);
});

test("collection vertex attribute", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionRowName);
  await setModelSurfacesVisibility(window, true);
  await setModelPolygonsVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
});

test("collection type random color", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionTypeRowName);
  await setModelColoringStyle(window, "Random");
  await moveMouseOutOfTheWay(window);
});
