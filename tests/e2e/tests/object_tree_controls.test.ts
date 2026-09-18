// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { afterActionWait, moveMouseOutOfTheWay } from "@tests/utils/viewer_interaction";
import {
  checkFilterCategory,
  copyTreeRowId,
  fillSearchQuery,
  hideObjectInTree,
  openFilterMenu,
  toggleSearchObjects,
  toggleSortObjects,
  uncheckFilterCategory,
} from "@tests/utils/object_trees/common";
import {
  collapseMainObjectTree,
  getMainObjectTree,
  toggleObjectsTree,
} from "@tests/utils/object_trees/main_object_tree";
import {
  collapseModelComponentsObjectTree,
  expandModelComponentsObjectTree,
  getModelComponentsObjectTree,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
} from "@tests/utils/object_trees/model_components_object_tree";
import { brepGeodeObjectType } from "@tests/utils/constants";
import { closeAllMenus } from "@tests/utils/app_interaction";
import { loadVeaseTestDatas } from "@tests/utils/load";
import { resetApp } from "@tests/utils/navigate";
import { resetCamera } from "@tests/utils/camera_interaction";
import { test } from "@tests/utils/fixtures";

// Constants
const brepFilename = "test.og_brep";
const edc3dFilename = "test.og_edc3d";
const psf3dFilename = "test.og_psf3d";
const hso3dFilename = "test.og_hso3d";

let surfaceId = undefined;

test.describe.configure({ mode: "serial" });

test.afterAll(async ({ window, mode }) => {
  await resetApp(window, mode);
});

test("load all files", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await loadVeaseTestDatas(window, [edc3dFilename]);
  await loadVeaseTestDatas(window, [psf3dFilename]);
  await loadVeaseTestDatas(window, [hso3dFilename]);
});

test("reset camera", async ({ window }) => {
  await resetCamera(window);
});

test("filter objects", async ({ window }) => {
  await openFilterMenu(window, getMainObjectTree(window));
  await uncheckFilterCategory(window, "EdgedCurve3D");
  await uncheckFilterCategory(window, "PolygonalSurface3D");
});

test("sort by id", async ({ window }) => {
  await closeAllMenus(window);
  await toggleSortObjects(window);
});

test("sort by name", async ({ window }) => {
  await toggleSortObjects(window);
});

test("hide HybridSolid3D objects", async ({ window }) => {
  await hideObjectInTree(window, "HybridSolid3D", undefined, getMainObjectTree(window));
});

test("search by text", async ({ window }) => {
  await toggleSearchObjects(window);
  await fillSearchQuery(window, "test", getMainObjectTree(window));

  await fillSearchQuery(window, "", getMainObjectTree(window));
});

test("search by id", async ({ window, screenshotMask }) => {
  const mainObjectTree = getMainObjectTree(window);
  const brepLabel = mainObjectTree
    .locator('[data-testid^="treeRow-"]', { hasText: "test" })
    .first();
  const dataTestId = await brepLabel.getAttribute("data-testid");
  const brepId = dataTestId.replace("treeRow-", "");
  const searchPrefix = brepId.slice(0, 3);
  await fillSearchQuery(window, searchPrefix, mainObjectTree);
  screenshotMask.locators = [window.getByTestId("searchObjectsInput")];
});

test("refilter object", async ({ window }) => {
  const mainObjectTree = getMainObjectTree(window);
  await fillSearchQuery(window, "", mainObjectTree);
  await openFilterMenu(window, mainObjectTree);
  await checkFilterCategory(window, "PolygonalSurface3D");

  await closeAllMenus(window);
});

test("collapse main object tree", async ({ window }) => {
  await openModelComponentsTree(window, brepGeodeObjectType, "test");
  await collapseMainObjectTree(window);
});

test("toggle objects", async ({ window }) => {
  await toggleObjectsTree(window);
});

test("expand model components", async ({ window }) => {
  await expandModelComponentsObjectTree(window);
});

test("hide model blocks", async ({ window }) => {
  await hideObjectInTree(window, "Blocks", undefined, getModelComponentsObjectTree(window));
});

test("filter model components", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree.getByTestId("filterObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("filterCheckbox-Blocks").getByRole("checkbox").uncheck();
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("filterCheckbox-Lines").getByRole("checkbox").uncheck();
  await window.waitForTimeout(afterActionWait);
});

test("sort model components by id", async ({ window }) => {
  await closeAllMenus(window);
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree.getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
});

test("sort model components by name", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree.getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
});

test("search model components by text", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree.getByTestId("searchObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  const searchInput = modelComponentsObjectTree.getByTestId("searchObjectsInput").locator("input");
  await searchInput.fill("ff");
  await window.waitForTimeout(afterActionWait);
});

test("hide filtered corners", async ({ window }) => {
  await hideObjectInTree(window, "Corners", undefined, getModelComponentsObjectTree(window));
});

test("color filtered surfaces", async ({ window }) => {
  await setModelTreeRowColorRandom(window, "Surfaces");
});

test("clear searchbar", async ({ window }) => {
  await window.keyboard.press("Escape");
});

test("clear model components searchbar", async ({ window }) => {
  await fillSearchQuery(window, "", getModelComponentsObjectTree(window));
});

test("copy surface id", async ({ window }) => {
  surfaceId = await copyTreeRowId(
    window,
    "Surfaces",
    "00000000-",
    getModelComponentsObjectTree(window),
  );
  expect(surfaceId).toBeTruthy();
});

test("search by copied surface id", async ({ window, screenshotMask }) => {
  expect(surfaceId).toBeTruthy();
  await fillSearchQuery(window, surfaceId, getModelComponentsObjectTree(window));
  screenshotMask.locators = [
    window.getByTestId("modelComponentsObjectTree").getByTestId("searchObjectsInput"),
  ];
});

test("collapse all model components", async ({ window }) => {
  await fillSearchQuery(window, "", getModelComponentsObjectTree(window));
  await collapseModelComponentsObjectTree(window);
});
