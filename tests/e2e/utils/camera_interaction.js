import { afterActionWait, dragElement, hybridViewerCanvas } from "./viewer_interaction.js";

async function resetCamera(window) {
  await window.getByTestId("resetCameraButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window, deltaX, deltaY = 0) {
  const canvas = hybridViewerCanvas(window)
  await dragElement(window, canvas, { deltaX, deltaY });
}

async function toggleCenterOnClick(window) {
  await window.getByTestId("centerOnClickButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleGridScale(window) {
  await window.getByTestId("gridScaleButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function changeZScaling(window, zScaleValue) {
  await window.getByTestId("zScalingButton").click();
  await window.waitForTimeout(afterActionWait);

  const input = window.getByTestId("zScaleInput").locator("input");
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

export {
  changeZScaling,
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
};
