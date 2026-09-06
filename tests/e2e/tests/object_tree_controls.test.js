// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import { afterActionWait, moveMouseOutOfTheWay } from "@tests/utils/viewer_interaction.js";
import {
  checkFilterCategory,
  collapseMainObjectTree,
  collapseModelComponentsObjectTree,
  expandModelComponentsObjectTree,
  fillSearchQuery,
  getMainObjectTree,
  hideObjectInTree,
  openFilterMenu,
  setModelTreeRowColorRandom,
  toggleObjectsTree,
  toggleSearchObjects,
  toggleSortObjects,
  uncheckFilterCategory,
} from "@tests/utils/object_tree_interaction.js";
import { loadDatas } from "@tests/utils/load.js";
import { resetCamera } from "@tests/utils/camera_interaction.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const edc3dFilename = "test.og_edc3d";
const psf3dFilename = "test.og_psf3d";
const hso3dFilename = "test.og_hso3d";

test.describe.configure({ mode: "serial" });

test("load all files", async ({ window }) => {
  await loadDatas(window, [brepFilename]);
  await loadDatas(window, [edc3dFilename]);
  await loadDatas(window, [psf3dFilename]);
  await loadDatas(window, [hso3dFilename]);
});

test("reset camera", async ({ window }) => {
  await resetCamera(window);
});

test("filter objects", async ({ window }) => {
  await openFilterMenu(window);
  await uncheckFilterCategory(window, "EdgedCurve3D");
  await uncheckFilterCategory(window, "PolygonalSurface3D");

  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("sort by id", async ({ window }) => {
  await toggleSortObjects(window);
});

test("sort by name", async ({ window }) => {
  await toggleSortObjects(window);
});

test("hide HybridSolid3D objects", async ({ window }) => {
  await hideObjectInTree(window, "HybridSolid3D");
});

test("search by text", async ({ window }) => {
  await toggleSearchObjects(window);
  await fillSearchQuery(window, "test");

  await fillSearchQuery(window, "");
});

test("search by id", async ({ window }) => {
  const mainObjectTree = getMainObjectTree(window);
  const brepLabel = mainObjectTree
    .locator('[data-testid^="treeRow-"]', { hasText: "test" })
    .first();
  const dataTestId = await brepLabel.getAttribute("data-testid");
  const brepId = dataTestId.replace("treeRow-", "");
  const searchPrefix = brepId.slice(0, 3);
  await fillSearchQuery(window, searchPrefix);
  await expect(window).toHaveScreenshot({
    mask: [window.getByTestId("searchObjectsInput")],
  });
  await fillSearchQuery(window, "");
});

test("refilter object", async ({ window }) => {
  await openFilterMenu(window);
  await checkFilterCategory(window, "PolygonalSurface3D");

  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("collapse main object tree", async ({ window }) => {
  const mainObjectTree = getMainObjectTree(window);
  await mainObjectTree
    .locator(".tree-row-wrapper", { hasText: "test" })
    .first()
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await window.waitForTimeout(afterActionWait);
  await collapseMainObjectTree(window);
});

test("toggle objects", async ({ window }) => {
  await toggleObjectsTree(window);
});

test("expand model components", async ({ window }) => {
  await expandModelComponentsObjectTree(window);
});

test("hide model blocks", async ({ window }) => {
  await hideObjectInTree(window, "Blocks", undefined, "modelComponentsObjectTree");
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
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree.getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
});

test("sort model components by name", async ({ window }) => {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await modelComponentsObjectTree.getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
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
  await hideObjectInTree(window, "Corners", undefined, "modelComponentsObjectTree");
});

test("color filtered surfaces", async ({ window }) => {
  await setModelTreeRowColorRandom(window, "Surfaces");
});

test("clear searchbar", async ({ window }) => {
  await window.keyboard.press("Escape");
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const searchInput = modelComponentsObjectTree.getByTestId("searchObjectsInput").locator("input");
  await searchInput.fill("");
});

test("collapse all model components", async ({ window }) => {
  await collapseModelComponentsObjectTree(window);
});
