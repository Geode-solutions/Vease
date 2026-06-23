// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  hideObjectInTree,
  loadData,
  navigateToApp,
} from "@tests/utils/viewer_interaction.js";
import {
  checkFilterCategory,
  expandAllObjects,
  fillSearchQuery,
  openFilterMenu,
  toggleSearchObjects,
  toggleSortObjects,
  uncheckFilterCategory,
} from "@tests/utils/object_tree_interaction.js";
import { resetCamera } from "@tests/utils/camera_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const edc3dFilename = "test.og_edc3d";
const psf3dFilename = "test.og_psf3d";
const hso3dFilename = "test.og_hso3d";

let window = undefined;
let cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load all files", async () => {
  await loadData(window, brepFilename);
  await loadData(window, edc3dFilename);
  await loadData(window, psf3dFilename);
  await loadData(window, hso3dFilename);
  await expect(window).toHaveScreenshot();
});

test("expand all", async () => {
  await resetCamera(window);
  await expandAllObjects(window);
  await expect(window).toHaveScreenshot();
});

test("filter objects", async () => {
  await openFilterMenu(window);
  await uncheckFilterCategory(window, "HybridSolid3D");
  await uncheckFilterCategory(window, "PolygonalSurface3D");
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("sort by id", async () => {
  await toggleSortObjects(window);
  await expect(window).toHaveScreenshot();
});

test("sort by name", async () => {
  await toggleSortObjects(window);
  await expect(window).toHaveScreenshot();
});

test("hide edgedcurve3d objects", async () => {
  await hideObjectInTree(window, "EdgedCurve3D");
  await expect(window).toHaveScreenshot();
});

test("search by text", async () => {
  await toggleSearchObjects(window);
  await fillSearchQuery(window, "test");
  await expect(window).toHaveScreenshot();
  await fillSearchQuery(window, "");
});

test("search by id", async () => {
  const brepLabel = window
    .getByTestId("mainObjectTree")
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

test("refilter object", async () => {
  await openFilterMenu(window);
  await checkFilterCategory(window, "PolygonalSurface3D");
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("collapse main object tree", async () => {
  await window
    .getByTestId("mainObjectTree")
    .locator(".tree-row-wrapper", { hasText: "test" })
    .first()
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("mainObjectTree").getByTestId("collapseAllObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("toggle objects", async () => {
  await window.getByTestId("toggleObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("expand model components", async () => {
  await window
    .getByTestId("modelComponentsObjectTree")
    .getByTestId("expandAllObjectsButton")
    .click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("filter model components", async () => {
  await window.getByTestId("modelComponentsObjectTree").getByTestId("filterObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("filterCheckbox-Blocks").getByRole("checkbox").uncheck();
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("filterCheckbox-Lines").getByRole("checkbox").uncheck();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
});

test("sort model components by id", async () => {
  await window.getByTestId("modelComponentsObjectTree").getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("sort model components by name", async () => {
  await window.getByTestId("modelComponentsObjectTree").getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("search model components by text", async () => {
  await window.getByTestId("modelComponentsObjectTree").getByTestId("searchObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
  const searchInput = window
    .getByTestId("modelComponentsObjectTree")
    .getByTestId("searchObjectsInput")
    .locator("input");
  await searchInput.fill("ff");
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
  await window.waitForTimeout(afterActionWait);
});

test("hide filtered corners", async () => {
  await hideObjectInTree(window, "Corners", "modelComponentsObjectTree");
  await expect(window).toHaveScreenshot();
});

test("clear searchbar", async () => {
  const searchInput = window
    .getByTestId("modelComponentsObjectTree")
    .getByTestId("searchObjectsInput")
    .locator("input");
  await searchInput.fill("");
  await expect(window).toHaveScreenshot();
});

test("collapse all model components", async () => {
  await window
    .getByTestId("modelComponentsObjectTree")
    .getByTestId("collapseAllObjectsButton")
    .click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});
