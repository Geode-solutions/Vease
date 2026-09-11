import {
  MAX_PERCENTAGE,
  clickColorPickerCanvas,
  clickColorPickerSlider,
  clickCopyColorBtn,
  pasteColorInputText,
  setColorInputText,
} from "@tests/utils/helpers/color_picker.js";
import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
} from "@tests/utils/viewer_interaction.js";

async function setColoringStyle(window, menuTestId, coloringStyle, container = window) {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  await container.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: coloringStyle, visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
}

async function setColor(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerCanvas(window, container);
}

async function setColorWithSlider(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerSlider(window, container);
  await clickColorPickerCanvas(window, container);
}

async function setOpacity(window, menuTestId, percent) {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const menu = window.getByTestId(menuTestId);
  const alphaSlider = menu
    .getByTestId("colorPicker")
    .locator(".v-color-picker-preview__alpha, .v-color-picker__alpha")
    .first();
  const box = await alphaSlider.boundingBox();
  await alphaSlider.click({
    force: true,
    position: { x: (box.width * percent) / MAX_PERCENTAGE, y: box.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

const COLOR_CANVAS_OFFSET = 5;

async function setColorBlack(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  const canvas = container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first();
  const box = await canvas.boundingBox();
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

function setFeatureColorBlack(window, viewerObjectType, feature, container = window) {
  return setColorBlack(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureColor(window, viewerObjectType, feature, container = window) {
  return setColor(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureColorWithSlider(window, viewerObjectType, feature, container = window) {
  return setColorWithSlider(window, `${viewerObjectType}${feature}Menu`, container);
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

function setFeatureColoringStyle(
  window,
  viewerObjectType,
  feature,
  coloringStyle,
  container = window,
) {
  return setColoringStyle(window, `${viewerObjectType}${feature}Menu`, coloringStyle, container);
}

function setFeatureOpacity(window, viewerObjectType, feature, percent) {
  return setOpacity(window, `${viewerObjectType}${feature}Menu`, percent);
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
