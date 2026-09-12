// Node imports

// Third party imports
import type { Page } from "@playwright/test";
// oxlint-disable-next-line eslint/no-duplicate-imports
import { expect } from "@playwright/test";

// Local imports
import {
  beforeAllTimeout,
  noopCleanup,
  setPointsSize,
  setPointsVisibility,
  toggleInfoCard,
  viewerContextMenu,
} from "@tests/utils/viewer_interaction";
import {
  defaultDataName,
  meshViewerObjectType,
  pointSetGeodeObjectType,
} from "@tests/utils/constants";
import { expandMainObjectTree, highlightData } from "@tests/utils/object_tree_interaction";
import {
  openMeshPointsMenu,
  setMeshPointsNoDataColor,
  setMeshPointsVertexAttribute,
} from "@tests/utils/mesh/points/attribute";
import { setMeshPointsColor, setMeshPointsOpacity } from "@tests/utils/mesh/points/color";
import { loadData } from "@tests/utils/load";
import { navigateToApp } from "@tests/utils/navigate";
import { test } from "@tests/fixtures";

// Constants
const inputFilename = "test.og_pts3d";
const vertexAttributeName = "test_vertex";
const vertexAttributeName2 = "test_vertex2";
const colorMapName = "vikO";
let window: Page = undefined as unknown as Page;
let cleanup: () => unknown = noopCleanup;
const pointsOpacity = 50;
const pointsSize = 15;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  test.setTimeout(beforeAllTimeout);
  ({ window, cleanup } = await navigateToApp(mode, browser));
});

test.afterAll(async () => {
  await cleanup();
});

test("load", async () => {
  await loadData(window, inputFilename);
  await expandMainObjectTree(window);
  await expect(window).toHaveScreenshot();
});

test("highlight", async () => {
  await highlightData(window, pointSetGeodeObjectType, defaultDataName);
  await expect(window).toHaveScreenshot();
});

test("viewer context menu", async () => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
  await expect(window).toHaveScreenshot();
});

test("info card", async () => {
  await toggleInfoCard(window);
  await expect(window).toHaveScreenshot();
  await toggleInfoCard(window);
});

test("points visibility", async () => {
  const visibility = false;
  await setPointsVisibility(window, meshViewerObjectType, visibility);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute", async () => {
  await setPointsVisibility(window, meshViewerObjectType, false);
  await setMeshPointsVertexAttribute(window, vertexAttributeName, {
    item: 1,
    colorMap: colorMapName,
  });
  await expect(window).toHaveScreenshot();
});

test("vertex attribute unmapped elements color", async () => {
  await setMeshPointsNoDataColor(window);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute change attribute name", async () => {
  await setMeshPointsVertexAttribute(window, vertexAttributeName2);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute switch back to first attribute", async () => {
  await setMeshPointsVertexAttribute(window, vertexAttributeName);
  await expect(window).toHaveScreenshot();
});

test("vertex attribute reopen menu", async () => {
  await openMeshPointsMenu(window);
  await expect(window).toHaveScreenshot();
});

test("points color", async () => {
  await setMeshPointsColor(window);
  await expect(window).toHaveScreenshot();
});

test("points opacity", async () => {
  await setMeshPointsOpacity(window, pointsOpacity);
  await expect(window).toHaveScreenshot();
});

test("points size", async () => {
  await setPointsSize(window, meshViewerObjectType, pointsSize);
  await expect(window).toHaveScreenshot();
});
