import type { Page } from "@playwright/test";

import { closeAllMenus, moveMouseOutOfTheWay } from "./app_interaction";
import { dragElement, getHybridViewerCanvas, waitForActionSettled } from "./viewer_interaction";

async function resetCamera(window: Page): Promise<void> {
  await window.getByTestId("resetCameraButton").click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

async function rotateCamera(window: Page, deltaX: number, deltaY = 0): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await dragElement(window, hybridViewerCanvas, { deltaX, deltaY });
}

async function toggleCenterOnClick(window: Page): Promise<void> {
  await window.getByTestId("centerOnClickButton").click();
  await waitForActionSettled(window);
}

async function toggleGridScale(window: Page): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("gridScaleButton").click();
  await waitForActionSettled(window);
}

async function setZScaling(window: Page, zScaleValue: number): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("zScalingButton").click();
  await waitForActionSettled(window);

  const panel = window.getByTestId("zScaleInput");
  if (!(await panel.isVisible())) {
    await window.getByTestId("zScalingButton").click();
    await waitForActionSettled(window);
  }

  const input = panel.locator("input");
  await input.fill(zScaleValue.toString());
  await input.press("Enter");
  await waitForActionSettled(window);
  await window.getByTestId("toolPanelActionButton").click();
  await waitForActionSettled(window);
}

async function toggleCameraManager(window: Page): Promise<void> {
  await window.getByTestId("cameraManagerButton").click();
  await waitForActionSettled(window);
}

async function saveCameraPosition(window: Page, name: string): Promise<void> {
  const input = window.getByTestId("cameraPositionNameInput").locator("input");
  await input.fill(name);
  await waitForActionSettled(window);
  await window.getByTestId("saveCameraPositionButton").click();
  await waitForActionSettled(window);
}

async function closeCameraManager(window: Page): Promise<void> {
  await window.getByTestId("closeCameraManagerButton").click();
  await waitForActionSettled(window);
}

async function toggleCameraOrientation(window: Page): Promise<void> {
  await window.getByTestId("cameraOrientationButton").click();
  await waitForActionSettled(window);
}

async function selectCameraOrientation(window: Page, label: string): Promise<void> {
  const vtkKey = label.replace("+", "Plus").replace("-", "Minus");
  await window.getByTestId(`cameraOrientation${vtkKey}Button`).click();
  await waitForActionSettled(window);
}

async function restoreCameraPosition(window: Page, name: string): Promise<void> {
  await window.getByTestId(`restoreCameraPosition${name}Button`).click();
  await waitForActionSettled(window);
}

async function ensureHighlightMenuOpen(window: Page, childButtonTestId: string): Promise<void> {
  if (!(await window.getByTestId(childButtonTestId).isVisible())) {
    await window.getByTestId("highlightOnHoverButton").click();
    await waitForActionSettled(window);
    if (!(await window.getByTestId(childButtonTestId).isVisible())) {
      await window.getByTestId("highlightOnHoverButton").click();
      await waitForActionSettled(window);
    }
  }
}

async function toggleShrinkFilter(window: Page): Promise<void> {
  await window.getByTestId("shrinkFilterButton").click();
  await waitForActionSettled(window);
}

async function setShrinkFactor(window: Page, shrinkFactorValue: number): Promise<void> {
  const slider = window.getByTestId("shrinkFactorSlider");
  const box = await slider.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the shrink factor slider.");
  }
  const clickX = box.width * shrinkFactorValue;
  await slider.click({ position: { x: clickX, y: box.height / 2 } });
  await waitForActionSettled(window);
}

async function resetShrinkFilter(window: Page): Promise<void> {
  await window.getByTestId("resetShrinkButton").click();
  await waitForActionSettled(window);
}

async function toggleShrinkTargetAllVisible(window: Page): Promise<void> {
  const switchElement = window.getByTestId("shrinkTargetAllVisibleSwitch");
  const checkbox = switchElement.getByRole("checkbox");
  await checkbox.click();
  await waitForActionSettled(window);
}

async function selectShrinkDatasets(window: Page, datasetName: string, index = 0): Promise<void> {
  const select = window.getByTestId("shrinkSelectedDatasetsSelect");
  await select.click();
  await waitForActionSettled(window);
  const option = window.getByRole("option", { name: datasetName }).nth(index);
  await option.click();
  await waitForActionSettled(window);
  await select.click();
  await waitForActionSettled(window);
}

async function toggleThresholdFilter(window: Page): Promise<void> {
  await window.getByTestId("thresholdFilterButton").click();
  await waitForActionSettled(window);
}

async function selectThresholdOption(
  window: Page,
  selectTestId: string,
  name: string,
): Promise<void> {
  await window.getByTestId(selectTestId).click();
  await waitForActionSettled(window);
  await window.getByRole("option", { name, exact: true }).click();
  await waitForActionSettled(window);
}

async function selectThresholdAttribute(
  window: Page,
  datasetName: string,
  attributeType: string,
  attributeName: string,
): Promise<void> {
  await selectThresholdOption(window, "thresholdDatasetSelect", datasetName);
  await selectThresholdOption(window, "thresholdAttributeTypeSelect", attributeType);
  await selectThresholdOption(window, "thresholdAttributeSelect", attributeName);
}

async function setThresholdMinimum(window: Page, minimum: number): Promise<void> {
  const input = window
    .getByTestId("thresholdFilterPanel")
    .getByTestId("attributeMinInput")
    .locator("input");
  await input.fill(minimum.toString());
  await input.press("Enter");
  await waitForActionSettled(window);
}

async function resetThresholdFilter(window: Page): Promise<void> {
  await window.getByTestId("resetThresholdButton").click();
  await waitForActionSettled(window);
}

async function removeThresholdFilter(window: Page): Promise<void> {
  await window.getByTestId("removeThresholdButton").click();
  await waitForActionSettled(window);
}

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
  toggleThresholdFilter,
  selectThresholdAttribute,
  setThresholdMinimum,
  resetThresholdFilter,
  removeThresholdFilter,
  toggleRuler,
  toggleRulerSnap,
  setRulerPointInput,
  clearRuler,
};
