// Node imports

// Third party imports

// Local imports
import {
  clickPickButton,
  closePickingBanner,
  fillPointsCoords,
  openCreateToolsPanel,
  pickPointInViewer,
  selectCreateTool,
  submitCreateObject,
  toggleClosedCurve,
} from "@tests/utils/create_objects.js";
import { test } from "@tests/utils/fixtures.js";

// Constants
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

test.describe.configure({ mode: "serial" });

test("open create tools", async ({ window }) => {
  await openCreateToolsPanel(window);
});

test("open create point tool", async ({ window }) => {
  await selectCreateTool(window, "Point");
});

test("fill points coordinates", async ({ window }) => {
  await fillPointsCoords(window, POINTS_COORDS);
});

test("pick in viewer", async ({ window }) => {
  await clickPickButton(window);
});

test("pick points and create pointset", async ({ window }) => {
  await pickPointInViewer(window, VIEWER_POINTS_COORDS[0].x, VIEWER_POINTS_COORDS[0].y);
  await pickPointInViewer(window, VIEWER_POINTS_COORDS[1].x, VIEWER_POINTS_COORDS[1].y);
  await submitCreateObject(window);
});

test("open create curve tool", async ({ window }) => {
  await openCreateToolsPanel(window);
  await selectCreateTool(window, "Curve");
});

test("fill curve coordinates", async ({ window }) => {
  await fillPointsCoords(window, CURVE_COORDS);
});

test("pick curve points and escape key", async ({ window }) => {
  await clickPickButton(window);
  await pickPointInViewer(window, VIEWER_CURVE_COORDS[0].x, VIEWER_CURVE_COORDS[0].y);
  await pickPointInViewer(window, VIEWER_CURVE_COORDS[1].x, VIEWER_CURVE_COORDS[1].y);
  await window.keyboard.press("Escape");
});

test("close curve and create curve", async ({ window }) => {
  await toggleClosedCurve(window);
  await submitCreateObject(window);
});

test("open create surface tool", async ({ window }) => {
  await openCreateToolsPanel(window);
  await selectCreateTool(window, "PolygonalSurface");
});

test("fill surface coordinates", async ({ window }) => {
  await fillPointsCoords(window, SURFACE_COORDS);
});

test("pick surface and click close", async ({ window }) => {
  await clickPickButton(window);
  await pickPointInViewer(window, VIEWER_SURFACE_COORDS[0].x, VIEWER_SURFACE_COORDS[0].y);
  await pickPointInViewer(window, VIEWER_SURFACE_COORDS[1].x, VIEWER_SURFACE_COORDS[1].y);
  await closePickingBanner(window);
});

test("create surface", async ({ window }) => {
  await submitCreateObject(window);
});
