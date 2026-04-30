// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  loadData,
  navigateToApp,
  viewerContextMenu,
} from "@tests/utils.js";
import { test } from "@tests/fixtures.js";

// Constants
const inputFilename = "test.og_brep";
let window = undefined;
let cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549,
    y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("points visibility", async () => {
  const brepPointsMenuButton = await window.getByTestId("modelPointsMenu");
  console.log("Toggle BRep points visibility", brepPointsMenuButton);
  await brepPointsMenuButton.click();
  const modelPointsVisibilitySwitch = await window
    .getByTestId("modelPointsVisibilitySwitch")
    .getByRole("checkbox");
  await modelPointsVisibilitySwitch.check();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("object tree context menu", async () => {
  console.log("Right click on the BRep from object tree");
  const mainObjectTree = window.getByTestId("mainObjectTree");
  const BRepRow = mainObjectTree.locator(".tree-row-wrapper").filter({ hasText: "BRep" }).first();
  await BRepRow.locator(".mdi-menu-right").first().click();
  await mainObjectTree.getByText("test").click({
    button: "right",
    position: {
      x: 10,
      y: 10,
    },
  });
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("edges visibility", async () => {
  const brepEdgesMenuButton = await window.getByTestId("modelEdgesMenu");
  console.log("Toggle BRep edges visibility", brepEdgesMenuButton);
  await brepEdgesMenuButton.click();
  const modelEdgesVisibilitySwitch = await window
    .getByTestId("modelEdgesVisibilitySwitch")
    .getByRole("checkbox");
  console.log("Toggle BRep edges visibility", modelEdgesVisibilitySwitch);
  await modelEdgesVisibilitySwitch.check();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
});

test("object tree model components", async () => {
  const mainObjectTree = window.getByTestId("mainObjectTree");

  await mainObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "test" })
    .locator("button:has(.mdi-magnify-expand)")
    .click();
  await window.waitForTimeout(afterActionWait);

  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");

  const BlocksRow = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "Blocks" });

  await BlocksRow.locator(".mdi-eye").first().click();
  await window.waitForTimeout(afterActionWait);

  const SurfacesRow = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: "Surfaces" });

  await SurfacesRow.locator(".mdi-menu-right").first().click();
  await window.waitForTimeout(afterActionWait);

  const surfaceIds = [
    "00000000-8afd-4969-8000-000092a43747",
    "00000000-1702-4d26-8000-000004d7ea39",
    "00000000-6732-4f29-8000-00002f66bc93",
    "00000000-cddf-4c1c-8000-00005ebbcaeb",
    "00000000-dc1c-420d-8000-000070dcfff5",
    "00000000-dcfe-400a-8000-0000a72c4f30",
  ];

  for (const surfaceId of surfaceIds) {
    console.log(`Unchecking surface: ${surfaceId}`);
    const surfaceRow = modelComponentsObjectTree
      .locator(".tree-row-wrapper")
      .filter({ hasText: surfaceId })
      .first();
    // oxlint-disable-next-line no-await-in-loop
    await surfaceRow.locator(".mdi-eye").first().click({ force: true });
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(afterActionWait);
  }
  const importButton = await window.getByRole("button", { name: "Import" });
  await importButton.hover();
  await window.waitForTimeout(waitAfterActionRender);
  await expect(window).toHaveScreenshot();
});
