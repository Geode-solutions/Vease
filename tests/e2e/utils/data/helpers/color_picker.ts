import { afterActionWait } from "@tests/utils/viewer_interaction";

const MAX_PERCENTAGE = 100;
const SLIDER_BLUE = 0.7;
const SLIDER_PINK = 0.85;

async function clickColorPickerCanvas(window, container = window) {
  await container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function clickColorPickerSlider(window, container = window, percentage = SLIDER_BLUE) {
  let targetContainer = container;
  let targetPercentage = percentage;
  if (typeof container === "number") {
    targetPercentage = container;
    targetContainer = window;
  }
  const rgbaSlider = targetContainer.getByTestId("colorPicker").locator(".v-slider").first();
  const rgbaBox = await rgbaSlider.boundingBox();
  await rgbaSlider.click({
    position: { x: rgbaBox.width * targetPercentage, y: rgbaBox.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

export { clickColorPickerCanvas, clickColorPickerSlider, MAX_PERCENTAGE, SLIDER_BLUE, SLIDER_PINK };
