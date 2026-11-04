import { type Page, expect } from "@playwright/test";

import { closeAllMenus, moveMouseOutOfTheWay } from "./app_interaction";
import { dragElement } from "./viewer_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

async function toggleRuler(window: Page): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("rulerButton").click();
  await waitForActionSettled(window);
}

async function toggleRulerSnap(window: Page): Promise<void> {
  const switchElement = window.getByTestId("rulerSnapToggle");
  const checkbox = switchElement.getByRole("checkbox");
  await checkbox.click();
  await waitForActionSettled(window);
}

async function setRulerPointInput(
  window: Page,
  pointIndex: number,
  coords: number[],
): Promise<void> {
  const card = window.getByTestId("rulerPointCard").nth(pointIndex - 1);
  for (let axis = 0; axis < coords.length; axis += 1) {
    const input = card.getByTestId("rulerPointCoordInput").nth(axis).locator("input");
    // oxlint-disable-next-line no-await-in-loop
    await input.fill(coords[axis].toString());
  }
  await window.getByTestId("rulerApplyButton").click();
  await waitForActionSettled(window);
}

async function clearRuler(window: Page): Promise<void> {
  await window.getByTestId("rulerClearButton").click();
  await waitForActionSettled(window);
}

async function activateZoomToBox(window: Page): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("zoomToBoxButton").click();
  await waitForActionSettled(window);
  await expect(window.getByTestId("zoomBoxActiveChip")).toBeVisible();
}

async function drawZoomBox(window: Page, deltaX: number, deltaY: number): Promise<void> {
  const overlay = window.getByTestId("zoomBoxOverlay");
  await dragElement(window, overlay, { deltaX, deltaY });
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
  await expect(window.getByTestId("zoomBoxActiveChip")).toBeHidden();
}

export {
  toggleRuler,
  toggleRulerSnap,
  setRulerPointInput,
  clearRuler,
  activateZoomToBox,
  drawZoomBox,
};
