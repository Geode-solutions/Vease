// Third party imports
import type { Locator, Page } from "@playwright/test";

// Local imports
import { waitForActionSettled } from "./wait_for_action_settled";

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
  await waitForActionSettled(window);
}

interface DragOptions {
  startX?: number;
  startY?: number;
  targetX?: number;
  targetY?: number;
  deltaX?: number;
  deltaY?: number;
}

async function dragElement(
  window: Page,
  locator: Locator,
  { startX: fromX, startY: fromY, targetX, targetY, deltaX = 0, deltaY = 0 }: DragOptions = {},
): Promise<void> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the element to drag.");
  }
  const { x, y, width, height } = box;
  const startX = fromX ?? x + width / 2;
  const startY = fromY ?? y + height / 2;
  await window.mouse.move(startX, startY);
  await window.mouse.down();
  await window.mouse.move(targetX ?? startX + deltaX, targetY ?? startY + deltaY, { steps: 20 });
  await window.mouse.up();
  await waitForActionSettled(window);
}

async function dragContextMenu(
  window: Page,
  { targetX, targetY }: DragOptions = {},
): Promise<void> {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await dragElement(window, centerButton, { targetX, targetY });
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
  await waitForActionSettled(window);
}

async function stabilizeHoverTooltip(window: Page): Promise<void> {
  await window.addStyleTag({
    content: ".tooltip-value-dim { visibility: hidden !important; }",
  });
}

async function toggleInfoCard(window: Page): Promise<void> {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await centerButton.click();
  await waitForActionSettled(window);
}

const SCALAR_BAR_X_RATIO = 0.25;
const SCALAR_BAR_Y_RATIO = 0.9;

function getQuickColormapPicker(window: Page): Locator {
  return window
    .locator(".v-overlay__content")
    .filter({ has: window.getByTestId("colorMapListFilter") });
}

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
  await waitForActionSettled(window);
}

export {
  dragContextMenu,
  dragElement,
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  getQuickColormapPicker,
  hoverViewer,
  stabilizeHoverTooltip,
  toggleInfoCard,
  viewerContextMenu,
  viewerQuickColormap,
};
