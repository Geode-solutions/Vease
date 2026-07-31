import { afterActionWait } from "./viewer_interaction.js";

async function toggleClippingPlanes(window) {
  await window.getByTestId("clippingPlanesButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function invertPlaneNormal(window, planeIndex = 0) {
  const planeCard = window.getByTestId("planeCard").nth(planeIndex);
  await planeCard.getByTestId("invertNormalButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function setPlaneValues(window, testId, planeIndex, values) {
  const planeCard = window.getByTestId("planeCard").nth(planeIndex);
  const inputs = planeCard.getByTestId(testId).locator("input");
  await Promise.all(
    values.map(async (value, axis) => {
      const input = inputs.nth(axis);
      await input.fill(value.toString());
      await input.press("Enter");
    }),
  );
  await window.waitForTimeout(afterActionWait);
}

async function setPlaneOrigin(window, planeIndex, origin) {
  await setPlaneValues(window, "planeOriginInput", planeIndex, origin);
}

async function setPlaneNormal(window, planeIndex, normal) {
  await setPlaneValues(window, "planeNormalInput", planeIndex, normal);
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
