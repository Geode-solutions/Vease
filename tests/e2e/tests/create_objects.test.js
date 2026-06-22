// Node imports

// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  addPointRow,
  clickPickButton,
  closePickingBanner,
  fillPointCoords,
  openCreateToolsPanel,
  pickPointInViewer,
  selectCreateTool,
  submitCreateObject,
  toggleClosedCurve,
} from "@tests/utils/create_objects.js";
import { beforeAllTimeout, navigateToApp } from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants
let window = undefined;
let cleanup = undefined;
const POINTS_COORDS = [
  { x: 0, y: 0, z: 0 },
  { x: -0.2, y: 0.14, z: 0.09 },
];
const VIEWER_POINTS_COORDS = [
  { x: 500, y: 300 },
  { x: 550, y: 400 },
];

const CURVE_COORDS = [
  { x: 0.1, y: 0, z: 0 },
  { x: 0, y: 0.1, z: 0 },
  { x: 0.1, y: 0.2, z: 0 },
];

const VIEWER_CURVE_COORDS = [
  { x: 600, y: 300 },
  { x: 650, y: 350 },
];

const SURFACE_COORDS = [
  { x: -0.1, y: 0, z: 0 },
  { x: 0, y: -0.1, z: 0 },
  { x: -0.1, y: -0.1, z: 0 },
  { x: -0.15, y: -0.1, z: 0 },
];

const VIEWER_SURFACE_COORDS = [
  { x: 700, y: 400 },
  { x: 600, y: 450 },
];

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("open create tools", async () => {
  await openCreateToolsPanel(window);
  await expect(window).toHaveScreenshot();
});

test("open create point tool", async () => {
  await selectCreateTool(window, "Point");
  await expect(window).toHaveScreenshot();
});

test("fill points coordinates", async () => {
  await fillPointCoords(window, 0, POINTS_COORDS[0].x, POINTS_COORDS[0].y, POINTS_COORDS[0].z);
  await addPointRow(window);
  await fillPointCoords(window, 1, POINTS_COORDS[1].x, POINTS_COORDS[1].y, POINTS_COORDS[1].z);
  await expect(window).toHaveScreenshot();
});

test("pick in viewer", async () => {
  await clickPickButton(window);
  await expect(window).toHaveScreenshot();
});

test("pick points and create pointset", async () => {
  await pickPointInViewer(window, VIEWER_POINTS_COORDS[0].x, VIEWER_POINTS_COORDS[0].y);
  await pickPointInViewer(window, VIEWER_POINTS_COORDS[1].x, VIEWER_POINTS_COORDS[1].y);
  await submitCreateObject(window);
  await expect(window).toHaveScreenshot();
});

test("open create curve tool", async () => {
  await openCreateToolsPanel(window);
  await selectCreateTool(window, "Curve");
  await expect(window).toHaveScreenshot();
});

test("fill curve coordinates", async () => {
  await fillPointCoords(window, 0, CURVE_COORDS[0].x, CURVE_COORDS[0].y, CURVE_COORDS[0].z);
  await fillPointCoords(window, 1, CURVE_COORDS[1].x, CURVE_COORDS[1].y, CURVE_COORDS[1].z);
  await addPointRow(window);
  await fillPointCoords(window, 2, CURVE_COORDS[2].x, CURVE_COORDS[2].y, CURVE_COORDS[2].z);
  await expect(window).toHaveScreenshot();
});

test("pick curve points and escape key", async () => {
  await clickPickButton(window);
  await pickPointInViewer(window, VIEWER_CURVE_COORDS[0].x, VIEWER_CURVE_COORDS[0].y);
  await pickPointInViewer(window, VIEWER_CURVE_COORDS[1].x, VIEWER_CURVE_COORDS[1].y);
  await window.keyboard.press("Escape");
  await expect(window).toHaveScreenshot();
});

test("close curve and create curve", async () => {
  await toggleClosedCurve(window);
  await submitCreateObject(window);
  await expect(window).toHaveScreenshot();
});

test("open create surface tool", async () => {
  await openCreateToolsPanel(window);
  await selectCreateTool(window, "PolygonalSurface");
  await expect(window).toHaveScreenshot();
});

test("fill surface coordinates", async () => {
  await fillPointCoords(window, 0, SURFACE_COORDS[0].x, SURFACE_COORDS[0].y, SURFACE_COORDS[0].z);
  await fillPointCoords(window, 1, SURFACE_COORDS[1].x, SURFACE_COORDS[1].y, SURFACE_COORDS[1].z);
  await fillPointCoords(window, 2, SURFACE_COORDS[2].x, SURFACE_COORDS[2].y, SURFACE_COORDS[2].z);
  await addPointRow(window);
  await fillPointCoords(window, 3, SURFACE_COORDS[3].x, SURFACE_COORDS[3].y, SURFACE_COORDS[3].z);
  await expect(window).toHaveScreenshot();
});

test("pick surface and click close", async () => {
  await clickPickButton(window);
  await pickPointInViewer(window, VIEWER_SURFACE_COORDS[0].x, VIEWER_SURFACE_COORDS[0].y);
  await pickPointInViewer(window, VIEWER_SURFACE_COORDS[1].x, VIEWER_SURFACE_COORDS[1].y);
  await closePickingBanner(window);
  await expect(window).toHaveScreenshot();
});

test("create surface", async () => {
  await submitCreateObject(window);
  await expect(window).toHaveScreenshot();
});
