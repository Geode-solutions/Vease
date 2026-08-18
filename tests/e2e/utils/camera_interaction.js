import {
  afterActionWait,
  dragElement,
  getHybridViewerCanvas,
  moveMouseOutOfTheWay,
} from "./viewer_interaction.js";

async function resetCamera(window) {
  await window.getByTestId("resetCameraButton").click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window, deltaX, deltaY = 0) {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  await dragElement(window, hybridViewerCanvas, { deltaX, deltaY });
}

async function toggleCenterOnClick(window) {
  await window.getByTestId("centerOnClickButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleGridScale(window) {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("gridScaleButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function setZScaling(window, zScaleValue) {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);

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

async function toggleCameraManager(window) {
  await window.getByTestId("cameraManagerButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function saveCameraPosition(window, name) {
  const input = window.getByTestId("cameraPositionNameInput").locator("input");
  await input.fill(name);
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("saveCameraPositionButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function closeCameraManager(window) {
  await window.getByTestId("closeCameraManagerButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleCameraOrientation(window) {
  await window.getByTestId("cameraOrientationButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function selectCameraOrientation(window, label) {
  const vtkKey = label.replace("+", "Plus").replace("-", "Minus");
  await window.getByTestId(`cameraOrientation${vtkKey}Button`).click();
  await window.waitForTimeout(afterActionWait);
}

async function restoreCameraPosition(window, name) {
  await window.getByTestId(`restoreCameraPosition${name}Button`).click();
  await window.waitForTimeout(afterActionWait);
}

async function ensureHighlightMenuOpen(window, childButtonTestId) {
  if (!(await window.getByTestId(childButtonTestId).isVisible())) {
    await window.getByTestId("highlightOnHoverButton").click();
    await window.waitForTimeout(afterActionWait);
    if (!(await window.getByTestId(childButtonTestId).isVisible())) {
      await window.getByTestId("highlightOnHoverButton").click();
      await window.waitForTimeout(afterActionWait);
    }
  }
}

async function toggleShrinkFilter(window) {
  await window.getByTestId("shrinkFilterButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function setShrinkFactor(window, shrinkFactorValue) {
  const slider = window.getByTestId("shrinkFactorSlider");
  const box = await slider.boundingBox();
  const clickX = box.width * shrinkFactorValue;
  await slider.click({ position: { x: clickX, y: box.height / 2 } });
  await window.waitForTimeout(afterActionWait);
}

async function resetShrinkFilter(window) {
  await window.getByTestId("resetShrinkButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleShrinkTargetAllVisible(window) {
  const switchElement = window.getByTestId("shrinkTargetAllVisibleSwitch");
  const checkbox = switchElement.getByRole("checkbox");
  await checkbox.click();
  await window.waitForTimeout(afterActionWait);
}

async function selectShrinkDatasets(window, datasetName, index = 0) {
  const select = window.getByTestId("shrinkSelectedDatasetsSelect");
  await select.click();
  await window.waitForTimeout(afterActionWait);
  const option = window.getByRole("option", { name: datasetName }).nth(index);
  await option.click();
  await window.waitForTimeout(afterActionWait);
  await select.click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleRuler(window) {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("rulerButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleRulerSnap(window) {
  const switchElement = window.getByTestId("rulerSnapToggle");
  const checkbox = switchElement.getByRole("checkbox");
  await checkbox.click();
  await window.waitForTimeout(afterActionWait);
}

async function setRulerPointInput(window, pointIndex, coords) {
  const card = window.getByTestId("rulerPointCard").nth(pointIndex - 1);
  for (let axis = 0; axis < coords.length; axis += 1) {
    const input = card.getByTestId("rulerPointCoordInput").nth(axis).locator("input");
    // oxlint-disable-next-line no-await-in-loop
    await input.fill(coords[axis].toString());
  }
  await window.getByTestId("rulerApplyButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function clearRuler(window) {
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
