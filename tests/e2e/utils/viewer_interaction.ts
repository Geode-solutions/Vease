// Third party imports
import type { Locator, Page } from "@playwright/test";

// Local imports
// oxlint-disable-next-line unicorn/prefer-export-from
import { afterActionWait, halfSecondWait } from "./constants";
// oxlint-disable-next-line unicorn/prefer-export-from
import { moveMouseOutOfTheWay } from "./app_interaction";

function noopCleanup(): unknown {
  return undefined;
}

function getHybridViewerCanvas(window: Page): Locator {
  return window.getByTestId("hybridViewer").locator("canvas");
}

async function getHybridViewerCanvasBoundingBox(
  hybridViewerCanvas: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> {
  const box = await hybridViewerCanvas.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the hybrid viewer canvas.");
  }
  return box;
}

async function viewerContextMenu(window: Page, x: number, y: number): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await hybridViewerCanvas.click({
    button: "right",
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
}

async function findOverlappingObjectsPicker(window: Page): Promise<void> {
  let found = false;
  const points = [
    { x: 440, y: 530 },
    { x: 600, y: 400 },
    { x: 600, y: 500 },
    { x: 600, y: 300 },
    { x: 500, y: 400 },
    { x: 700, y: 400 },
    { x: 550, y: 450 },
    { x: 650, y: 350 },
    { x: 650, y: 450 },
    { x: 550, y: 350 },
    { x: 400, y: 400 },
    { x: 800, y: 400 },
    { x: 450, y: 550 },
    { x: 500, y: 500 },
  ];

  for (const { x, y } of points) {
    // oxlint-disable-next-line no-await-in-loop
    await window.getByTestId("hybridViewer").locator("canvas").click({
      button: "right",
      position: { x, y },
      delay: 100,
    });
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(afterActionWait);

    // oxlint-disable-next-line no-await-in-loop
    const items = await window.locator(".intermediate-picker-item").count();
    if (items >= 2) {
      found = true;
      break;
    }
    // oxlint-disable-next-line no-await-in-loop
    await window.keyboard.press("Escape");
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(halfSecondWait);
  }

  if (!found) {
    throw new Error(
      "Could not find overlapping objects picker anywhere! The test data might not be loaded or the picker is broken.",
    );
  }
}

async function ensureMenuOpen(window: Page, menuTestId: string): Promise<void> {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  if (!(await centerButton.isVisible())) {
    const contextMenuX = 549;
    const contextMenuY = 360;
    await viewerContextMenu(window, contextMenuX, contextMenuY);
  }
  const menuContainer = window.getByTestId(menuTestId);
  const activeCircularMenuItemButton = menuContainer.getByTestId("activeCircularMenuItemButton");
  if (!(await activeCircularMenuItemButton.isVisible())) {
    const activeMenuButton = window.getByTestId("activeCircularMenuItemButton");
    if (await activeMenuButton.isVisible()) {
      await activeMenuButton.click();
      await window.waitForTimeout(afterActionWait);
    }
    const menuButton = menuContainer
      .getByTestId("circularMenuItemButton")
      .or(menuContainer.getByTestId("activeCircularMenuItemButton"))
      .first();
    await menuButton.click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function ensureFeatureVisible(window: Page, menuTestId: string): Promise<void> {
  const switchTestId = menuTestId.replace("Menu", "VisibilitySwitch");
  const visibilitySwitch = window.getByTestId(switchTestId).getByRole("checkbox");
  if (!(await visibilitySwitch.isChecked())) {
    await visibilitySwitch.check({ force: true });
    // Wait for conditionally rendered options to appear
    await window.waitForTimeout(halfSecondWait);
  }
}

interface DragOptions {
  targetX?: number;
  targetY?: number;
  deltaX?: number;
  deltaY?: number;
}

async function dragElement(
  window: Page,
  locator: Locator,
  { targetX, targetY, deltaX = 0, deltaY = 0 }: DragOptions = {},
): Promise<void> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the element to drag.");
  }
  const { x, y, width, height } = box;
  const startX = x + width / 2;
  const startY = y + height / 2;
  await window.mouse.move(startX, startY);
  await window.mouse.down();
  await window.mouse.move(targetX ?? startX + deltaX, targetY ?? startY + deltaY, { steps: 20 });
  await window.mouse.up();
  await window.waitForTimeout(afterActionWait);
}

async function dragContextMenu(
  window: Page,
  { targetX, targetY }: DragOptions = {},
): Promise<void> {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await dragElement(window, centerButton, { targetX, targetY });
}

async function setFeatureTextures(
  window: Page,
  viewerObjectType: string,
  feature: string,
): Promise<void> {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const container = window.getByTestId(menuTestId);
  const selector = container.getByTestId("coloringStyleSelector").first();
  await selector.click();
  await window.waitForTimeout(afterActionWait);

  const listItem = window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: "Textures", visible: true })
    .first();
  await listItem.click();
  await window.waitForTimeout(afterActionWait);
}

async function setPolygonsTextures(window: Page, viewerObjectType: string): Promise<void> {
  await setFeatureTextures(window, viewerObjectType, "Polygons");
}

async function hoverViewer(window: Page, position?: { x: number; y: number }): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the hybrid viewer canvas.");
  }
  const hoverPosition = position ?? { x: box.width / 2, y: box.height / 2 };
  await hybridViewerCanvas.hover({
    position: hoverPosition,
  });
  await window.waitForTimeout(afterActionWait);
}

async function stabilizeHoverTooltip(window: Page): Promise<void> {
  await window.addStyleTag({
    content: ".tooltip-value-dim { visibility: hidden !important; }",
  });
}

async function setVisibilityGeneric(
  window: Page,
  menuTestId: string,
  switchTestId: string,
  visibility: boolean,
): Promise<void> {
  await ensureMenuOpen(window, menuTestId);
  const checkbox = window.getByTestId(switchTestId).getByRole("checkbox");
  if (visibility) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
  await window.waitForTimeout(afterActionWait);
}

async function setFeatureVisibility(
  window: Page,
  viewerObjectType: string,
  feature: string,
  visibility: boolean,
): Promise<void> {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  const switchTestId = `${viewerObjectType}${feature}VisibilitySwitch`;
  await setVisibilityGeneric(window, menuTestId, switchTestId, visibility);
}

async function setFeatureSizeOrWidth(
  window: Page,
  viewerObjectType: string,
  feature: string,
  value: number,
): Promise<void> {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  let sliderTestId = `${viewerObjectType}${feature}SizeSlider`;
  if (feature === "Edges") {
    sliderTestId = `${viewerObjectType}${feature}WidthSlider`;
  }
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const slider = window.getByTestId(sliderTestId);
  await slider
    .locator("input")
    .first()
    .evaluate((node: HTMLInputElement, val: string) => {
      node.value = val;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, value.toString());
  await window.waitForTimeout(afterActionWait);
}

// Specific feature functions
async function setPointsVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  if (viewerObjectType === "model") {
    await setVisibilityGeneric(
      window,
      "modelPointsMenu",
      "modelPointsVisibilitySwitch",
      visibility,
    );
    return;
  }
  await setFeatureVisibility(window, viewerObjectType, "Points", visibility);
}
async function setEdgesVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Edges", visibility);
}
async function setPolygonsVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Polygons", visibility);
}
async function setPolyhedraVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Polyhedra", visibility);
}
async function setCellsVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Cells", visibility);
}

async function setPointsSize(window: Page, viewerObjectType: string, value: number): Promise<void> {
  await setFeatureSizeOrWidth(window, viewerObjectType, "Points", value);
}
async function setEdgesWidth(window: Page, viewerObjectType: string, value: number): Promise<void> {
  await setFeatureSizeOrWidth(window, viewerObjectType, "Edges", value);
}

async function toggleInfoCard(window: Page): Promise<void> {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await centerButton.click();
  await window.waitForTimeout(afterActionWait);
}

async function resetMenuScroll(window: Page, scrollTop = 0): Promise<void> {
  await window.evaluate((top) => {
    const cardTexts = document.querySelectorAll(".v-card-text");
    for (const cardTextElement of cardTexts) {
      cardTextElement.scrollTop = top;
    }
  }, scrollTop);
}

async function openStyleMenu(window: Page, menuTestId: string): Promise<void> {
  const activeMenuButton = window.getByTestId("activeCircularMenuItemButton");
  if (await activeMenuButton.isVisible()) {
    await activeMenuButton.click();
    await window.waitForTimeout(afterActionWait);
  }
  await ensureMenuOpen(window, menuTestId);
  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

const SCALAR_BAR_X_RATIO = 0.25;
const SCALAR_BAR_Y_RATIO = 0.9;

async function viewerQuickColormap(window: Page, x?: number, y?: number): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await hybridViewerCanvas.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the hybrid viewer canvas.");
  }
  const targetX = x ?? Math.round(box.width * SCALAR_BAR_X_RATIO);
  const targetY = y ?? Math.round(box.height * SCALAR_BAR_Y_RATIO);

  await hybridViewerCanvas.click({
    button: "left",
    position: { x: targetX, y: targetY },
    force: true,
  });
  await window.waitForTimeout(afterActionWait);
}

export {
  afterActionWait,
  noopCleanup,
  dragContextMenu,
  dragElement,
  ensureFeatureVisible,
  ensureMenuOpen,
  findOverlappingObjectsPicker,
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  hoverViewer,
  moveMouseOutOfTheWay,
  openStyleMenu,
  resetMenuScroll,
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsTextures,
  setPolygonsVisibility,
  setPolyhedraVisibility,
  setVisibilityGeneric,
  stabilizeHoverTooltip,
  toggleInfoCard,
  viewerContextMenu,
  viewerQuickColormap,
};
