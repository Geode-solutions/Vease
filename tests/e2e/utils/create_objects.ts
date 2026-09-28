import type { Locator, Page } from "@playwright/test";

import { getHybridViewerCanvas } from "./viewer_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

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
    await waitForActionSettled(window);
  }
}

async function closeCreateToolsPanel(window: Page): Promise<void> {
  const createToolsPanelButton = getCreateToolsPanelButton(window);
  const isOpen = await createToolsPanelButton.isVisible();
  if (isOpen) {
    await window.getByTestId("createButton").click();
    await waitForActionSettled(window);
  }
}

async function selectCreateTool(window: Page, toolId: string): Promise<void> {
  const createToolButton = window.getByTestId(`createToolCard-${toolId}`);
  await createToolButton.click();
  await waitForActionSettled(window);
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
  await waitForActionSettled(window);
  await inputs.nth(1).fill(y.toString());
  await waitForActionSettled(window);
  await inputs.nth(2).fill(z.toString());
  await waitForActionSettled(window);
}

async function addPointRow(window: Page): Promise<void> {
  await window.getByTestId("addPointButton").click();
  await waitForActionSettled(window);
}

async function fillPointsCoords(window: Page, coords: PointCoords[]): Promise<void> {
  async function fillNext(index: number): Promise<void> {
    const point = coords[index];
    if (point === undefined) {
      return;
    }
    const row = window.getByTestId(`point-${index}`);
    if ((await row.count()) === 0) {
      await addPointRow(window);
    }
    const { x, y, z } = point;
    await fillPointCoords(window, index, x, y, z);
    await fillNext(index + 1);
  }
  await fillNext(0);
}

async function clickPickButton(window: Page): Promise<void> {
  await window.getByTestId("pickButton").click();
  await waitForActionSettled(window);
}

async function pickPointInViewer(window: Page, x: number, y: number): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await hybridViewerCanvas.click({
    position: { x, y },
  });
  await waitForActionSettled(window);
}

async function submitCreateObject(window: Page): Promise<void> {
  await window.getByTestId("submitButton").click();
  await waitForActionSettled(window);
}

async function closePickingBanner(window: Page): Promise<void> {
  await window.getByTestId("pickingActiveChip").click();
  await waitForActionSettled(window);
}

async function toggleClosedCurve(window: Page): Promise<void> {
  await window.getByTestId("closedCurveCheckbox").getByRole("checkbox").check();
  await waitForActionSettled(window);
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
