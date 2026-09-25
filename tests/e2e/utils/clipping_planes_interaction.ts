import type { Page } from "@playwright/test";
import { waitForActionSettled } from "./viewer_interaction";

async function toggleClippingPlanes(window: Page): Promise<void> {
  await window.getByTestId("clippingPlanesButton").click();
  await waitForActionSettled(window);
}

async function invertPlaneNormal(window: Page, planeIndex = 0): Promise<void> {
  await window.getByTestId("invertNormalButton").nth(planeIndex).click();
  await waitForActionSettled(window);
}

async function setPlaneOrigin(window: Page, planeIndex: number, origin: number[]): Promise<void> {
  const card = window.getByTestId("planeCard").nth(planeIndex);
  for (let axis = 0; axis < origin.length; axis += 1) {
    const input = card.getByTestId("planeOriginInput").nth(axis).locator("input");
    // oxlint-disable no-await-in-loop
    await input.fill(origin[axis].toString());
    await input.press("Enter");
  }
  await waitForActionSettled(window);
}

async function setPlaneNormal(window: Page, planeIndex: number, normal: number[]): Promise<void> {
  const card = window.getByTestId("planeCard").nth(planeIndex);
  for (let axis = 0; axis < normal.length; axis += 1) {
    const input = card.getByTestId("planeNormalInput").nth(axis).locator("input");
    await input.fill(normal[axis].toString());
    await input.press("Enter");
    // oxlint-enable no-await-in-loop
  }
  await waitForActionSettled(window);
}

async function addClippingPlane(window: Page): Promise<void> {
  await window.getByTestId("addPlaneButton").click();
  await waitForActionSettled(window);
}

async function toggleTargetAllVisible(window: Page): Promise<void> {
  await window.getByTestId("targetAllVisibleSwitch").getByRole("checkbox").click();
  await waitForActionSettled(window);
}

async function selectClippingDatasets(window: Page, datasetName: string, index = 0): Promise<void> {
  await window.getByTestId("selectedDatasetsSelect").click();
  await waitForActionSettled(window);
  await window.getByRole("option", { name: datasetName }).nth(index).click();
  await waitForActionSettled(window);
  await window.getByTestId("selectedDatasetsSelect").click();
  await waitForActionSettled(window);
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
