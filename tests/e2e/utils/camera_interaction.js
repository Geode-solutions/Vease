import { afterActionWait } from "./viewer_interaction.js";

async function resetCamera(window) {
  await window.getByTestId("resetCameraButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window, deltaX, deltaY = 0) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  const box = await canvas.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  await window.mouse.move(centerX, centerY);
  await window.mouse.down({ button: "left" });
  await window.mouse.move(centerX + deltaX, centerY + deltaY, { steps: 20 });
  await window.mouse.up({ button: "left" });

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
