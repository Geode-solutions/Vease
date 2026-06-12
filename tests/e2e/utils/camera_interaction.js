import { afterActionWait, dragElement } from "./viewer_interaction.js";

async function resetCamera(window) {
  await window.locator("button:has(.mdi-cube-scan)").click();
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window, deltaX, deltaY = 0) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  await dragElement(window, canvas, { deltaX, deltaY });
}

async function toggleCenterOnClick(window) {
  await window.locator("button:has(.mdi-crosshairs-question)").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleGridScale(window) {
  await window.locator("button:has(.mdi-ruler-square)").click();
  await window.waitForTimeout(afterActionWait);
}

async function changeZScaling(window, zScaleValue) {
  await window.locator("button:has(.mdi-sort)").click();
  await window.waitForTimeout(afterActionWait);

  const input = window.getByLabel("Z Scale Value");
  await input.fill(zScaleValue.toString());
  await input.press("Enter");
  await window.waitForTimeout(afterActionWait);
  await window.getByRole("button", { name: "Apply" }).click();
  await window.waitForTimeout(afterActionWait);
}

export { changeZScaling, resetCamera, rotateCamera, toggleCenterOnClick, toggleGridScale };
