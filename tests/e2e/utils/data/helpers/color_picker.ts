import type { Locator, Page } from "@playwright/test";
import { afterActionWait } from "@vease_tests/utils/viewer_interaction";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";

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

async function clickCopyColorBtn(window: Page, container: Page | Locator = window): Promise<void> {
  await container.getByTestId("copyColorBtn").click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function setColorInputText(
  window: Page,
  text: string,
  container: Page | Locator = window,
): Promise<void> {
  const input = container.getByTestId("colorInput");
  await input.fill(text);
  await input.press("Enter");
  await window.waitForTimeout(afterActionWait);
}

async function pasteColorInputText(
  window: Page,
  container: Page | Locator = window,
): Promise<void> {
  const textToPaste = await window.evaluate(async () => {
    const clipboardText = await navigator.clipboard.readText();
    return clipboardText;
  });
  const input = container.getByTestId("colorInput");
  await input.focus();
  await input.evaluate((inputElement, data) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", data);
    inputElement.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: dataTransfer, bubbles: true }),
    );
  }, textToPaste);
  await window.waitForTimeout(afterActionWait);
}

export {
  clickColorPickerCanvas,
  clickColorPickerSlider,
  clickCopyColorBtn,
  setColorInputText,
  pasteColorInputText,
  MAX_PERCENTAGE,
  SLIDER_BLUE,
  SLIDER_PINK,
};
