// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  changeColor,
  dragContextMenu,
  focusObjectInTree,
  hideObjectInTree,
  loadData,
  navigateToApp,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  changeZScaling,
  resetCamera,
  rotateCamera,
  toggleCenterOnClick,
  toggleGridScale,
} from "@tests/utils/camera_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const rgd3dFilename = "test.og_rgd3d";
let window = undefined;
let cleanup = undefined;
const ZSCALE_VALUE = 6.6;

const TARGET_TOP = 100;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup?.();
});

test("load", async () => {
  await loadData(window, brepFilename);
  await loadData(window, rgd3dFilename);
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
  const x = 440,
    y = 530;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("select RegularGrid3D and change color", async () => {
  await window
    .getByTestId("overlappingObjectsPicker")
    .locator(".v-list-item")
    .filter({ hasText: "RegularGrid3D" })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
  await changeColor(window, "meshCellsMenu");
  await expect(window).toHaveScreenshot();
});

test("overlapping objects context menu at top", async () => {
  await dragContextMenu(window, { targetY: TARGET_TOP });
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
});

test("visibility off grid and expand BRep focus", async () => {
  await hideObjectInTree(window, "RegularGrid3D");
  await focusObjectInTree(window, "BRep", "test");
  await expect(window).toHaveScreenshot();
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
  await changeZScaling(window, ZSCALE_VALUE);
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});
