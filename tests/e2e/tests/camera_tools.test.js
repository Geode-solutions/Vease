// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  dragContextMenu,
  expandGeodeObjectType,
  expandMainObjectTree,
  findOverlappingObjectsPicker,
  focusObjectInTree,
  hideObjectInTree,
  hoverViewerCenter,
  setColor,
  showObjectInTree,
  stabilizeHoverTooltip,
} from "@tests/utils/viewer_interaction.js";
import {
  closeCameraManager,
  ensureHighlightMenuOpen,
  resetCamera,
  restoreCameraPosition,
  rotateCamera,
  saveCameraPosition,
  selectCameraOrientation,
  setZScaling,
  toggleCameraManager,
  toggleCameraOrientation,
  toggleCenterOnClick,
  toggleGridScale,
} from "@tests/utils/camera_interaction.js";
import { loadData } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { test } from "@tests/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const brepDataName = "test";
const brepGeodeObjectType = "BRep";
const rgd3dFilename = "test.og_rgd3d";
const rgd3dDataName = "test";
const rgd3dGeodeObjectType = "RegularGrid3D";
let window = undefined;
let cleanup = undefined;
const ZSCALE_VALUE = 6.6;

const TARGET_TOP = 100;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, brepFilename);
  await loadData(window, rgd3dFilename);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("reset camera", async () => {
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});

test("rotate camera 180 degrees", async () => {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  const box = await canvas.boundingBox();
  await rotateCamera(window, -box.width);
  await expect(window).toHaveScreenshot();
});

test("overlapping objects context menu", async () => {
  await resetCamera(window);
  await findOverlappingObjectsPicker(window);
  await expect(window).toHaveScreenshot();
});

test("select regulargrid3d and change color", async () => {
  await window
    .locator(".intermediate-picker-item")
    .filter({ hasText: rgd3dGeodeObjectType })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
  await setColor(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
});

test("overlapping objects context menu at top", async () => {
  await dragContextMenu(window, { targetY: TARGET_TOP });
  await expect(window).toHaveScreenshot();
});

test("visibility off grid and expand brep focus", async () => {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);

  await expandGeodeObjectType(window, rgd3dGeodeObjectType);
  await hideObjectInTree(window, rgd3dGeodeObjectType, rgd3dDataName);

  await focusObjectInTree(window, brepGeodeObjectType, brepDataName);
  await window.mouse.move(0, 0);
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("center on click", async () => {
  await toggleCenterOnClick(window);
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  await canvas.click({
    position: { x: 750, y: 250 },
  });
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("toggle grid scale tool", async () => {
  await toggleGridScale(window);
  await expect(window).toHaveScreenshot();
});

test("z scaling value 6.6", async () => {
  await setZScaling(window, ZSCALE_VALUE);
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});

test("save camera position", async () => {
  await toggleCameraManager(window);
  await saveCameraPosition(window, "angle 1");
  await expect(window).toHaveScreenshot();
  await closeCameraManager(window);
});

test("camera orientation", async () => {
  await toggleCameraOrientation(window);
  await selectCameraOrientation(window, "X+");
  await expect(window).toHaveScreenshot();
});

test("z scaling value 1", async () => {
  await setZScaling(window, 1);
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});

test("cells hover highlight", async () => {
  await showObjectInTree(window, "BRep");
  await showObjectInTree(window, "test");
  await hideObjectInTree(window, "RegularGrid3D");
  await resetCamera(window);
  await ensureHighlightMenuOpen(window, "highlightOnHoverCellsButton");
  await window.getByTestId("highlightOnHoverCellsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewerCenter(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
});

test("points hover highlight", async () => {
  await ensureHighlightMenuOpen(window, "highlightOnHoverPointsButton");
  await window.getByTestId("highlightOnHoverPointsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewerCenter(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
  await window.getByTestId("hoverHighlightChip").click();
  await window.waitForTimeout(afterActionWait);
});

test("highlight cells on grid", async () => {
  await showObjectInTree(window, "RegularGrid3D");
  await hideObjectInTree(window, "BRep");
  await resetCamera(window);
  await ensureHighlightMenuOpen(window, "highlightOnHoverCellsButton");
  await window.getByTestId("highlightOnHoverCellsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewerCenter(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
  await window.getByTestId("highlightOnHoverButton").click();
  await window.waitForTimeout(afterActionWait);
});

test("highlight points on grid", async () => {
  await ensureHighlightMenuOpen(window, "highlightOnHoverPointsButton");
  await window.getByTestId("highlightOnHoverPointsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewerCenter(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
});

test("restore camera position", async () => {
  await toggleCameraManager(window);
  await restoreCameraPosition(window, "angle 1");
  await expect(window).toHaveScreenshot();
  await closeCameraManager(window);
});

test("screenshot file without background", async () => {
  // Close any open menus from previous test
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);

  await window.getByTestId("screenshotButton").click();
  await window.getByTestId("screenshotFileNameInput").locator("input").fill("screenshot 1");
  await window.getByTestId("screenshotIncludeBackgroundSwitch").getByRole("checkbox").uncheck();
  await window.getByTestId("screenshotActionButton").click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("screenshot clipboard with background", async () => {
  await window.getByTestId("screenshotButton").click();
  await window.getByTestId("screenshotClipboardButton").click();
  await window.getByTestId("screenshotIncludeBackgroundSwitch").getByRole("checkbox").check();
  await window.getByTestId("screenshotActionButton").click();
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});
