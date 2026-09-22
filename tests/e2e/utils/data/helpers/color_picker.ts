import type { Locator, Page } from "@playwright/test";
import { afterActionWait } from "@tests/utils/viewer_interaction";
import { moveMouseOutOfTheWay } from "@tests/utils/app_interaction";

const MAX_PERCENTAGE = 100;
const SLIDER_BLUE = 0.7;
const SLIDER_PINK = 0.85;

async function clickColorPickerCanvas(
  window: Page,
  container: Page | Locator = window,
): Promise<void> {
  await container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first().click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function clickColorPickerSlider(
  window: Page,
  container: Page | Locator | number = window,
  percentage: number = SLIDER_BLUE,
): Promise<void> {
  const targetContainer: Page | Locator = typeof container === "number" ? window : container;
  const targetPercentage: number = typeof container === "number" ? container : percentage;
  const rgbaSlider = targetContainer.getByTestId("colorPicker").locator(".v-slider").first();
  const rgbaBox = await rgbaSlider.boundingBox();
  if (!rgbaBox) {
    throw new Error("Could not get bounding box of the color slider");
  }
  await rgbaSlider.click({
    position: { x: rgbaBox.width * targetPercentage, y: rgbaBox.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

export { clickColorPickerCanvas, clickColorPickerSlider, MAX_PERCENTAGE, SLIDER_BLUE, SLIDER_PINK };
