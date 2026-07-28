import { afterActionWait } from "@tests/utils/viewer_interaction.js";

const MAX_PERCENTAGE = 100;
const SLIDER_BLUE = 0.7;

async function clickColorPickerCanvas(window, container = window) {
  await container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function clickColorPickerSlider(window, container = window) {
  const rgbaSlider = container.getByTestId("colorPicker").locator(".v-slider").first();
  const rgbaBox = await rgbaSlider.boundingBox();
  await rgbaSlider.click({
    position: { x: rgbaBox.width * SLIDER_BLUE, y: rgbaBox.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

export { clickColorPickerCanvas, clickColorPickerSlider, MAX_PERCENTAGE };
