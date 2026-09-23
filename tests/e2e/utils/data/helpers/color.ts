import type { Locator, Page } from "@playwright/test";
import {
  MAX_PERCENTAGE,
  clickColorPickerCanvas,
  clickColorPickerSlider,
  clickCopyColorBtn,
  pasteColorInputText,
  setColorInputText,
} from "@tests/utils/data/helpers/color_picker";
import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
} from "@tests/utils/viewer_interaction";
import { moveMouseOutOfTheWay } from "@tests/utils/app_interaction";

async function setColoringStyle(
  window: Page,
  menuTestId: string,
  coloringStyle: string,
  container: Page | Locator = window,
): Promise<void> {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  await container.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  const listItem = window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: coloringStyle, visible: true })
    .first();
  await listItem.waitFor({ state: "visible", timeout: 15_000 });
  await listItem.click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function setColor(
  window: Page,
  menuTestId: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerCanvas(window, container);
}

async function setColorWithSlider(
  window: Page,
  menuTestId: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerSlider(window, container);
  await clickColorPickerCanvas(window, container);
}

async function setOpacity(window: Page, menuTestId: string, percent: number): Promise<void> {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const menu = window.getByTestId(menuTestId);
  const alphaSlider = menu
    .getByTestId("colorPicker")
    .locator(".v-color-picker-preview__alpha, .v-color-picker__alpha")
    .first();
  const box = await alphaSlider.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the opacity slider");
  }
  await alphaSlider.click({
    force: true,
    position: { x: (box.width * percent) / MAX_PERCENTAGE, y: box.height / 2 },
  });
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

const COLOR_CANVAS_OFFSET = 5;

async function setColorBlack(
  window: Page,
  menuTestId: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColoringStyle(window, menuTestId, "Constant", container);
  const canvas = container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first();
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Could not get bounding box of the color canvas");
  }
  await canvas.click({
    position: { x: COLOR_CANVAS_OFFSET, y: box.height - COLOR_CANVAS_OFFSET },
  });
  await window.waitForTimeout(afterActionWait);
}

async function copyColor(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickCopyColorBtn(window, container);
}

async function setColorInput(window, menuTestId, colorText, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await setColorInputText(window, colorText, container);
}

async function pasteColorInput(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await pasteColorInputText(window, container);
}

async function setFeatureColorBlack(
  window: Page,
  viewerObjectType: string,
  feature: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColorBlack(window, `${viewerObjectType}${feature}Menu`, container);
}

async function setFeatureColor(
  window: Page,
  viewerObjectType: string,
  feature: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColor(window, `${viewerObjectType}${feature}Menu`, container);
}

async function setFeatureColorWithSlider(
  window: Page,
  viewerObjectType: string,
  feature: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColorWithSlider(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureCopyColor(window, viewerObjectType, feature, container = window) {
  return copyColor(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureColorInput(window, viewerObjectType, feature, colorText, container = window) {
  return setColorInput(window, `${viewerObjectType}${feature}Menu`, colorText, container);
}

function setFeaturePasteColorInput(window, viewerObjectType, feature, container = window) {
  return pasteColorInput(window, `${viewerObjectType}${feature}Menu`, container);
}

async function setFeatureColoringStyle(
  window: Page,
  viewerObjectType: string,
  feature: string,
  coloringStyle: string,
  container: Page | Locator = window,
): Promise<void> {
  await setColoringStyle(window, `${viewerObjectType}${feature}Menu`, coloringStyle, container);
}

async function setFeatureOpacity(
  window: Page,
  viewerObjectType: string,
  feature: string,
  percent: number,
): Promise<void> {
  await setOpacity(window, `${viewerObjectType}${feature}Menu`, percent);
}

export {
  copyColor,
  setColor,
  setColorBlack,
  setColorInput,
  setColorWithSlider,
  setColoringStyle,
  setOpacity,
  pasteColorInput,
  setFeatureColor,
  setFeatureColorBlack,
  setFeatureColorInput,
  setFeatureColoringStyle,
  setFeatureColorWithSlider,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
};
