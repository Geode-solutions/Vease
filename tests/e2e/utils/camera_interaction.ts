import type { Page } from "@playwright/test";

import { afterActionWait, dragElement, getHybridViewerCanvas } from "./viewer_interaction";
import { closeAllMenus, moveMouseOutOfTheWay } from "./app_interaction";

async function resetCamera(window: Page): Promise<void> {
  await window.getByTestId("resetCameraButton").click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window: Page, deltaX: number, deltaY = 0): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await dragElement(window, hybridViewerCanvas, { deltaX, deltaY });
}

async function toggleCenterOnClick(window: Page): Promise<void> {
  await window.getByTestId("centerOnClickButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleGridScale(window: Page): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("gridScaleButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function setZScaling(window: Page, zScaleValue: number): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("zScalingButton").click();
  await window.waitForTimeout(afterActionWait);

  const panel = window.getByTestId("zScaleInput");
  if (!(await panel.isVisible())) {
    await window.getByTestId("zScalingButton").click();
    await window.waitForTimeout(afterActionWait);
  }

  const input = panel.locator("input");
  await input.fill(zScaleValue.toString());
  await input.press("Enter");
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("toolPanelActionButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleCameraManager(window: Page): Promise<void> {
  await window.getByTestId("cameraManagerButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function saveCameraPosition(window: Page, name: string): Promise<void> {
  const input = window.getByTestId("cameraPositionNameInput").locator("input");
  await input.fill(name);
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("saveCameraPositionButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function closeCameraManager(window: Page): Promise<void> {
  await window.getByTestId("closeCameraManagerButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleCameraOrientation(window: Page): Promise<void> {
  await window.getByTestId("cameraOrientationButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function selectCameraOrientation(window: Page, label: string): Promise<void> {
  const vtkKey = label.replace("+", "Plus").replace("-", "Minus");
  await window.getByTestId(`cameraOrientation${vtkKey}Button`).click();
  await window.waitForTimeout(afterActionWait);
}

async function restoreCameraPosition(window: Page, name: string): Promise<void> {
  await window.getByTestId(`restoreCameraPosition${name}Button`).click();
  await window.waitForTimeout(afterActionWait);
}

async function ensureHighlightMenuOpen(window: Page, childButtonTestId: string): Promise<void> {
  if (!(await window.getByTestId(childButtonTestId).isVisible())) {
    await window.getByTestId("highlightOnHoverButton").click();
    await window.waitForTimeout(afterActionWait);
    if (!(await window.getByTestId(childButtonTestId).isVisible())) {
      await window.getByTestId("highlightOnHoverButton").click();
      await window.waitForTimeout(afterActionWait);
    }
  }
}

async function toggleShrinkFilter(window: Page): Promise<void> {
  await window.getByTestId("shrinkFilterButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function setShrinkFactor(window: Page, shrinkFactorValue: number): Promise<void> {
  const slider = window.getByTestId("shrinkFactorSlider");
  const box = await slider.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the shrink factor slider.");
  }
  const clickX = box.width * shrinkFactorValue;
  await slider.click({ position: { x: clickX, y: box.height / 2 } });
  await window.waitForTimeout(afterActionWait);
}

async function resetShrinkFilter(window: Page): Promise<void> {
  await window.getByTestId("resetShrinkButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleShrinkTargetAllVisible(window: Page): Promise<void> {
  const switchElement = window.getByTestId("shrinkTargetAllVisibleSwitch");
  const checkbox = switchElement.getByRole("checkbox");
  await checkbox.click();
  await window.waitForTimeout(afterActionWait);
}

async function selectShrinkDatasets(window: Page, datasetName: string, index = 0): Promise<void> {
  const select = window.getByTestId("shrinkSelectedDatasetsSelect");
  await select.click();
  await window.waitForTimeout(afterActionWait);
  const option = window.getByRole("option", { name: datasetName }).nth(index);
  await option.click();
  await window.waitForTimeout(afterActionWait);
  await select.click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleRuler(window: Page): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("rulerButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleRulerSnap(window: Page): Promise<void> {
  const switchElement = window.getByTestId("rulerSnapToggle");
  const checkbox = switchElement.getByRole("checkbox");
  await checkbox.click();
  await window.waitForTimeout(afterActionWait);
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
  await window.waitForTimeout(afterActionWait);
}

async function clearRuler(window: Page): Promise<void> {
  await window.getByTestId("rulerClearButton").click();
  await window.waitForTimeout(afterActionWait);
}

export {
  setZScaling,
  resetCamera,
  rotateCamera,
  toggleCenterOnClick,
  toggleGridScale,
  toggleCameraManager,
  saveCameraPosition,
  closeCameraManager,
  toggleCameraOrientation,
  selectCameraOrientation,
  restoreCameraPosition,
  ensureHighlightMenuOpen,
  toggleShrinkFilter,
  setShrinkFactor,
  resetShrinkFilter,
  toggleShrinkTargetAllVisible,
  selectShrinkDatasets,
  toggleRuler,
  toggleRulerSnap,
  setRulerPointInput,
  clearRuler,
};
