import { afterActionWait } from "./viewer_interaction.js";

async function toggleClippingPlanes(window) {
  await window.getByTestId("clippingPlanesButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function invertPlaneNormal(window, planeIndex = 0) {
  await window.getByTestId("invertNormalButton").nth(planeIndex).click();
  await window.waitForTimeout(afterActionWait);
}

async function setPlaneOrigin(window, planeIndex, origin) {
  const card = window.getByTestId("planeCard").nth(planeIndex);
  for (let axis = 0; axis < origin.length; axis += 1) {
    const input = card.getByTestId("planeOriginInput").nth(axis).locator("input");
    // oxlint-disable no-await-in-loop
    await input.fill(origin[axis].toString());
    await input.press("Enter");
  }
  await window.waitForTimeout(afterActionWait);
}

async function setPlaneNormal(window, planeIndex, normal) {
  const card = window.getByTestId("planeCard").nth(planeIndex);
  for (let axis = 0; axis < normal.length; axis += 1) {
    const input = card.getByTestId("planeNormalInput").nth(axis).locator("input");
    await input.fill(normal[axis].toString());
    await input.press("Enter");
    // oxlint-enable no-await-in-loop
  }
  await window.waitForTimeout(afterActionWait);
}

async function addClippingPlane(window) {
  await window.getByTestId("addPlaneButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleTargetAllVisible(window) {
  await window.getByTestId("targetAllVisibleSwitch").getByRole("checkbox").click();
  await window.waitForTimeout(afterActionWait);
}

async function selectClippingDatasets(window, datasetName, index = 0) {
  await window.getByTestId("selectedDatasetsSelect").click();
  await window.waitForTimeout(afterActionWait);
  await window.getByRole("option", { name: datasetName }).nth(index).click();
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
}

export {
  toggleClippingPlanes,
  invertPlaneNormal,
  setPlaneOrigin,
  setPlaneNormal,
  addClippingPlane,
  toggleTargetAllVisible,
  selectClippingDatasets,
};
