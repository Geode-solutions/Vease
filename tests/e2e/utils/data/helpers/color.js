import {
  MAX_PERCENTAGE,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/helpers/color_picker.js";
import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
} from "@tests/utils/viewer_interaction.js";

async function setColoringStyle(window, menuTestId, coloringStyle, container = window) {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const selector = container.getByTestId("coloringStyleSelector").first();
  await selector.waitFor({ state: "visible", timeout: 15_000 });
  await selector.click();
  await window.waitForTimeout(afterActionWait);

  const listItem = window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: coloringStyle, visible: true })
    .first();
  await listItem.waitFor({ state: "visible", timeout: 15_000 });
  await listItem.click();
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

function setFeatureColor(window, viewerObjectType, feature, container = window) {
  return setColor(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureColorWithSlider(window, viewerObjectType, feature, container = window) {
  return setColorWithSlider(window, `${viewerObjectType}${feature}Menu`, container);
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
  setColor,
  setColorWithSlider,
  setColoringStyle,
  setOpacity,
  setFeatureColor,
  setFeatureColoringStyle,
  setFeatureColorWithSlider,
  setFeatureOpacity,
};
