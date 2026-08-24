// oxlint-disable max-lines
// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  addClippingPlane,
  invertPlaneNormal,
  selectClippingDatasets,
  setPlaneNormal,
  toggleClippingPlanes,
  toggleTargetAllVisible,
} from "@tests/utils/clipping_planes_interaction.js";
import {
  afterActionWait,
  beforeAllTimeout,
  dragContextMenu,
  findOverlappingObjectsPicker,
  getHybridViewerCanvas,
  hoverViewer,
  moveMouseOutOfTheWay,
  setEdgesVisibility,
  stabilizeHoverTooltip,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  brepGeodeObjectType,
  defaultDataName,
  meshViewerObjectType,
  rgd3dGeodeObjectType,
} from "@tests/utils/constants.js";
import {
  clearRuler,
  closeCameraManager,
  ensureHighlightMenuOpen,
  resetCamera,
  resetShrinkFilter,
  restoreCameraPosition,
  rotateCamera,
  saveCameraPosition,
  selectCameraOrientation,
  selectShrinkDatasets,
  setRulerPointInput,
  setShrinkFactor,
  setZScaling,
  toggleCameraManager,
  toggleCameraOrientation,
  toggleCenterOnClick,
  toggleGridScale,
  toggleRuler,
  toggleRulerSnap,
  toggleShrinkFilter,
  toggleShrinkTargetAllVisible,
} from "@tests/utils/camera_interaction.js";
import {
  expandGeodeObjectType,
  expandMainObjectTree,
  focusObjectInTree,
  hideObjectInTree,
  showObjectInTree,
} from "@tests/utils/object_tree_interaction.js";
import { loadDatas } from "@tests/utils/load.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { setColor } from "@tests/utils/helpers/color.js";
import { test } from "@tests/fixtures.js";

// Constants
const brepFilename = "test.og_brep";
const rgd3dFilename = "grid.og_rgd3d";
let window = undefined;
let cleanup = undefined;
const ZSCALE_VALUE = 6.6;
const TARGET_TOP = 100;
const CUSTOM_NORMAL_VALUE = -0.2;
const CUSTOM_NORMAL_VALUE_X = -0.15;
const CUSTOM_NORMAL_VALUE_Y = -0.9;
const CUSTOM_NORMAL_VALUE_Z = 0.41;
const CUSTOM_SHRINK_FACTOR = 0.5;
const RULER_POINT_2_X = 1.8;
const RULER_POINT_2_Y = 16.8;
const RULER_POINT_2_Z = 44.9;
const RULER_SNAP_X_RATIO = 0.5;
const RULER_SNAP_POINT_1_Y_RATIO = 0.35;
const RULER_SNAP_POINT_2_Y_RATIO = 0.65;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadDatas(window, [brepFilename]);
  await loadDatas(window, [rgd3dFilename]);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("reset camera", async () => {
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});

test("grid edges visibility", async () => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
  await setEdgesVisibility(window, meshViewerObjectType, true);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("ruler tool pick point 1 and manual point 2", async () => {
  await window.keyboard.press("Escape");
  await toggleRuler(window);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  await hybridViewerCanvas.click({
    position: { x: box.width / 2, y: box.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
  await setRulerPointInput(window, 2, [RULER_POINT_2_X, RULER_POINT_2_Y, RULER_POINT_2_Z]);
  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});

test("ruler tool pick vertex snap points", async () => {
  await clearRuler(window);
  await toggleRuler(window);
  await toggleRulerSnap(window);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  await hybridViewerCanvas.click({
    position: {
      x: box.width * RULER_SNAP_X_RATIO,
      y: box.height * RULER_SNAP_POINT_1_Y_RATIO,
    },
  });
  await window.waitForTimeout(afterActionWait);
  await hybridViewerCanvas.click({
    position: {
      x: box.width * RULER_SNAP_X_RATIO,
      y: box.height * RULER_SNAP_POINT_2_Y_RATIO,
    },
  });
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
  await expect(window).toHaveScreenshot();
});

test("rotate camera 180 degrees", async () => {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  await rotateCamera(window, -box.width);
  await expect(window).toHaveScreenshot();
});

test("overlapping objects context menu", async () => {
  await toggleRuler(window);
  await clearRuler(window);
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
  await hideObjectInTree(window, rgd3dGeodeObjectType, "grid");

  await focusObjectInTree(window, brepGeodeObjectType, defaultDataName);
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);

  await expect(window).toHaveScreenshot();
});

test("center on click", async () => {
  await toggleCenterOnClick(window);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await hybridViewerCanvas.click({
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
  await hideObjectInTree(window, "RegularGrid3D");
  await resetCamera(window);
  await ensureHighlightMenuOpen(window, "highlightOnHoverCellsButton");
  await window.getByTestId("highlightOnHoverCellsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewer(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
});

test("points hover highlight", async () => {
  await ensureHighlightMenuOpen(window, "highlightOnHoverPointsButton");
  await window.getByTestId("highlightOnHoverPointsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewer(window);
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
  await hoverViewer(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
  await window.getByTestId("highlightOnHoverButton").click();
  await window.waitForTimeout(afterActionWait);
});

test("highlight points on grid", async () => {
  await ensureHighlightMenuOpen(window, "highlightOnHoverPointsButton");
  await window.getByTestId("highlightOnHoverPointsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewer(window);
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
  await window.keyboard.press("Escape");
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

test("open shrink filter tool", async () => {
  await toggleGridScale(window);
  await resetCamera(window);
  await showObjectInTree(window, "BRep");
  await toggleShrinkFilter(window);
  await expect(window).toHaveScreenshot();
  await toggleShrinkFilter(window);
});

test("open clipping planes tool", async () => {
  await toggleClippingPlanes(window);
  await expect(window).toHaveScreenshot();
});

test("clipping planes invert normal", async () => {
  await invertPlaneNormal(window, 0);
  await expect(window).toHaveScreenshot();
});

test("clipping planes custom origin and normal values", async () => {
  await setPlaneNormal(window, 0, [CUSTOM_NORMAL_VALUE, 1, CUSTOM_NORMAL_VALUE]);
  await expect(window).toHaveScreenshot();
});

test("clipping planes target specific brep dataset", async () => {
  await toggleTargetAllVisible(window);
  await selectClippingDatasets(window, "test");
  await hideObjectInTree(window, "RegularGrid3D");
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});

test("shrink filter factor 50 percent", async () => {
  await toggleClippingPlanes(window);
  await toggleShrinkFilter(window);
  await toggleShrinkTargetAllVisible(window);
  await selectShrinkDatasets(window, "test");
  await setShrinkFactor(window, CUSTOM_SHRINK_FACTOR);
  await expect(window).toHaveScreenshot();
});

test("clipping planes hover highlight on cell", async () => {
  await toggleShrinkFilter(window);
  await toggleCameraOrientation(window);
  await selectCameraOrientation(window, "Y+");
  await ensureHighlightMenuOpen(window, "highlightOnHoverCellsButton");
  await window.getByTestId("highlightOnHoverCellsButton").click();
  await window.waitForTimeout(afterActionWait);
  await hoverViewer(window, { x: 604, y: 490 });
  await stabilizeHoverTooltip(window);
  await expect(window).toHaveScreenshot();
});

test("clipping planes add second plane", async () => {
  await window.keyboard.press("Escape");
  await toggleClippingPlanes(window);
  await addClippingPlane(window);
  await expect(window).toHaveScreenshot();
});

test("shrink filter reset", async () => {
  await toggleClippingPlanes(window);
  await toggleShrinkFilter(window);
  await resetShrinkFilter(window);
  await expect(window).toHaveScreenshot();
});

test("clipping planes multiple planes and datas", async () => {
  await toggleShrinkFilter(window);
  await toggleCameraOrientation(window);
  await selectCameraOrientation(window, "X-");
  await showObjectInTree(window, "RegularGrid3D");
  await resetCamera(window);
  await toggleClippingPlanes(window);
  await selectClippingDatasets(window, "grid");
  await setPlaneNormal(window, 0, [1, 0, 0]);
  await setPlaneNormal(window, 1, [
    CUSTOM_NORMAL_VALUE_X,
    CUSTOM_NORMAL_VALUE_Y,
    CUSTOM_NORMAL_VALUE_Z,
  ]);
  await resetCamera(window);
  await expect(window).toHaveScreenshot();
});
