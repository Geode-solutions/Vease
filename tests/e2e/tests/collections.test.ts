// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { defaultDataName, structuralModelGeodeObjectType } from "@tests/utils/constants";
import {
  getModelComponentsObjectTree,
  openModelCollectionsTree,
  openModelComponentContextMenu,
  openModelComponentsTree,
  toggleModelTreeRow,
} from "@tests/utils/object_trees/model_components_object_tree";
import {
  setModelColor,
  setModelColoringStyle,
  setModelPolygonsVertexAttribute,
} from "@tests/utils/data";
import { afterActionWait } from "@tests/utils/viewer_interaction";
import { expandGeodeObjectTypeInTree } from "@tests/utils/object_trees/common";
import { loadVeaseTestDatas } from "@tests/utils/load";
import { moveMouseOutOfTheWay } from "@tests/utils/app_interaction";
import { resetCamera } from "@tests/utils/camera_interaction";
import { test } from "@tests/utils/fixtures";

// Constants
const structuralModelFilename = "test.og_strm";
const collectionTypeRowName = "ModelBoundaries";
const collectionRowName = "019ea684-373";
const componentsTreeIndex = 1;
const vertexAttributeName = "test_vertex";

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load structural model", async ({ window }) => {
  await loadVeaseTestDatas(window, [structuralModelFilename]);
  await resetCamera(window);
});

test("open collections tree", async ({ window }) => {
  await openModelCollectionsTree(window, structuralModelGeodeObjectType, defaultDataName);
  await expandGeodeObjectTypeInTree(
    window,
    collectionTypeRowName,
    getModelComponentsObjectTree(window),
  );
});

test("hide blocks", async ({ window }) => {
  await openModelComponentsTree(window, structuralModelGeodeObjectType, defaultDataName);
  await toggleModelTreeRow(window, "Blocks", 0, componentsTreeIndex);
  await moveMouseOutOfTheWay(window);
});

test("collection type color", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionTypeRowName);
  await expect(window.getByTestId("modelComponentTypeOptions")).toContainText("Surfaces Options");
  await setModelColor(window);
  await moveMouseOutOfTheWay(window);
});

test("collection visibility", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionRowName);
  await window.getByTestId("modelSurfacesVisibilitySwitch").getByRole("checkbox").uncheck();
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
});

test("collection vertex attribute", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionRowName);
  await window.getByTestId("modelSurfacesVisibilitySwitch").getByRole("checkbox").check();
  await window.waitForTimeout(afterActionWait);
  await setModelPolygonsVertexAttribute(window, vertexAttributeName, { item: 0, colorMap: "vikO" });
  await moveMouseOutOfTheWay(window);
});

test("collection type random color", async ({ window }) => {
  await openModelComponentContextMenu(window, collectionTypeRowName);
  await setModelColoringStyle(window, "Random");
  await moveMouseOutOfTheWay(window);
});
