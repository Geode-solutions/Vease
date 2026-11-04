import type { Locator, Page } from "@playwright/test";

import { waitForActionSettled } from "./wait_for_action_settled";

async function toggleShrinkFilter(window: Page): Promise<void> {
  await window.getByTestId("shrinkFilterButton").click();
  await waitForActionSettled(window);
}

async function setSliderRatio(window: Page, sliderTestId: string, ratio: number): Promise<void> {
  const slider = window.getByTestId(sliderTestId);
  const box = await slider.boundingBox();
  if (!box) {
    throw new Error(`Could not get bounding box of the ${sliderTestId} slider.`);
  }
  await slider.click({ position: { x: box.width * ratio, y: box.height / 2 } });
  await waitForActionSettled(window);
}

async function setShrinkFactor(window: Page, shrinkFactorValue: number): Promise<void> {
  await setSliderRatio(window, "shrinkFactorSlider", shrinkFactorValue);
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

async function toggleExplodeFilter(window: Page): Promise<void> {
  await window.getByTestId("explodeFilterButton").click();
  await waitForActionSettled(window);
}

async function setExplodeFactor(window: Page, explodeFactorValue: number): Promise<void> {
  await setSliderRatio(window, "explodeFactorSlider", explodeFactorValue);
}

async function resetExplodeFilter(window: Page): Promise<void> {
  await window.getByTestId("resetExplodeButton").click();
  await waitForActionSettled(window);
}

async function removeExplodeFilter(window: Page): Promise<void> {
  await window.getByTestId("removeExplodeButton").click();
  await waitForActionSettled(window);
}

async function toggleThresholdFilter(window: Page): Promise<void> {
  await window.getByTestId("thresholdFilterButton").click();
  await waitForActionSettled(window);
}

async function selectThresholdOption(window: Page, select: Locator, name: string): Promise<void> {
  await select.click();
  await waitForActionSettled(window);
  await window.getByRole("option", { name, exact: true }).click();
  await waitForActionSettled(window);
}

function thresholdCard(window: Page, cardIndex: number): Locator {
  return window.getByTestId("thresholdCard").nth(cardIndex);
}

async function selectThresholdCardAttribute(
  window: Page,
  attributeType: string,
  attributeName: string,
  cardIndex = 0,
): Promise<void> {
  const card = thresholdCard(window, cardIndex);
  await selectThresholdOption(
    window,
    card.getByTestId("thresholdAttributeTypeSelect"),
    attributeType,
  );
  await selectThresholdOption(window, card.getByTestId("thresholdAttributeSelect"), attributeName);
}

async function selectThresholdAttribute(
  window: Page,
  datasetName: string,
  attributeType: string,
  attributeName: string,
): Promise<void> {
  await selectThresholdOption(window, window.getByTestId("thresholdDatasetSelect"), datasetName);
  await selectThresholdCardAttribute(window, attributeType, attributeName);
}

async function selectThresholdCellAttribute(
  window: Page,
  datasetName: string,
  attributeName: string,
): Promise<void> {
  await selectThresholdAttribute(window, datasetName, "cell attribute", attributeName);
}

async function selectThresholdBlockPolyhedron(
  window: Page,
  datasetName: string,
  attributeName: string,
): Promise<void> {
  await selectThresholdAttribute(window, datasetName, "Block polyhedron attribute", attributeName);
}

async function selectThresholdSurfacePolygon(
  window: Page,
  datasetName: string,
  attributeName: string,
): Promise<void> {
  await selectThresholdAttribute(window, datasetName, "Surface polygon attribute", attributeName);
}

async function addThreshold(window: Page): Promise<void> {
  await window.getByTestId("addThresholdButton").click();
  await waitForActionSettled(window);
}

async function setThresholdMinimum(window: Page, minimum: number, cardIndex = 0): Promise<void> {
  const input = thresholdCard(window, cardIndex).getByTestId("attributeMinInput").locator("input");
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

export {
  toggleShrinkFilter,
  setShrinkFactor,
  resetShrinkFilter,
  toggleShrinkTargetAllVisible,
  selectShrinkDatasets,
  toggleExplodeFilter,
  setExplodeFactor,
  resetExplodeFilter,
  removeExplodeFilter,
  toggleThresholdFilter,
  selectThresholdCellAttribute,
  selectThresholdBlockPolyhedron,
  selectThresholdSurfacePolygon,
  selectThresholdCardAttribute,
  addThreshold,
  setThresholdMinimum,
  resetThresholdFilter,
  removeThresholdFilter,
};
