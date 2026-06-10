import { afterActionWait } from "./viewer_interaction.js";

async function resetCamera(window) {
  await window.getByTestId("resetCameraButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window, deltaX, deltaY = 0) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  const { x, y, width, height } = await canvas.boundingBox();
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  await window.mouse.move(centerX, centerY);
  await window.mouse.down();
  await window.mouse.move(centerX + deltaX, centerY + deltaY, { steps: 20 });
  await window.mouse.up();
  await window.waitForTimeout(afterActionWait);
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

export { changeZScaling, resetCamera, rotateCamera, toggleCenterOnClick, toggleGridScale };
