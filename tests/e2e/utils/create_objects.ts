import type { Locator, Page } from "@playwright/test";

import { afterActionWait, getHybridViewerCanvas } from "./viewer_interaction";

interface PointCoords {
  x: number;
  y: number;
  z: number;
}

function getCreateToolsPanelButton(window: Page): Locator {
  return window.getByTestId("createToolsPanel");
}

async function openCreateToolsPanel(window: Page): Promise<void> {
  const createToolsPanelButton = getCreateToolsPanelButton(window);
  const isOpen = await createToolsPanelButton.isVisible();
  if (!isOpen) {
    await window.getByTestId("createButton").click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function closeCreateToolsPanel(window: Page): Promise<void> {
  const createToolsPanelButton = getCreateToolsPanelButton(window);
  const isOpen = await createToolsPanelButton.isVisible();
  if (isOpen) {
    await window.getByTestId("createButton").click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function selectCreateTool(window: Page, toolId: string): Promise<void> {
  const createToolButton = window.getByTestId(`createToolCard-${toolId}`);
  await createToolButton.click();
  await window.waitForTimeout(afterActionWait);
}

async function fillPointCoords(
  window: Page,
  index: number,
  x: number,
  y: number,
  z: number,
): Promise<void> {
  const row = window.getByTestId(`point-${index}`);
  const inputs = row.locator("input");
  await inputs.nth(0).fill(x.toString());
  await window.waitForTimeout(afterActionWait);
  await inputs.nth(1).fill(y.toString());
  await window.waitForTimeout(afterActionWait);
  await inputs.nth(2).fill(z.toString());
  await window.waitForTimeout(afterActionWait);
}

async function addPointRow(window: Page): Promise<void> {
  await window.getByTestId("addPointButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function fillPointsCoords(window: Page, coords: PointCoords[]): Promise<void> {
  async function fillNext(index: number): Promise<void> {
    if (index >= coords.length) {
      return;
    }
    const row = window.getByTestId(`point-${index}`);
    if ((await row.count()) === 0) {
      await addPointRow(window);
    }
    const { x, y, z } = coords[index];
    await fillPointCoords(window, index, x, y, z);
    await fillNext(index + 1);
  }
  await fillNext(0);
}

async function clickPickButton(window: Page): Promise<void> {
  await window.getByTestId("pickButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function pickPointInViewer(window: Page, x: number, y: number): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await hybridViewerCanvas.click({
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
}

async function submitCreateObject(window: Page): Promise<void> {
  await window.getByTestId("submitButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function closePickingBanner(window: Page): Promise<void> {
  await window.getByTestId("pickingActiveChip").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleClosedCurve(window: Page): Promise<void> {
  await window.getByTestId("closedCurveCheckbox").getByRole("checkbox").check();
  await window.waitForTimeout(afterActionWait);
}

export {
  openCreateToolsPanel,
  closeCreateToolsPanel,
  selectCreateTool,
  fillPointCoords,
  fillPointsCoords,
  addPointRow,
  clickPickButton,
  pickPointInViewer,
  submitCreateObject,
  closePickingBanner,
  toggleClosedCurve,
};
