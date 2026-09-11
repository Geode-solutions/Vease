import { afterActionWait, moveMouseOutOfTheWay } from "@tests/utils/viewer_interaction.js";

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

async function clickCopyColorBtn(window, container = window) {
  await container.getByTestId("copyColorBtn").click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function setColorInputText(window, text, container = window) {
  const input = container.getByTestId("colorInput");
  await input.fill(text);
  await input.press("Enter");
  await window.waitForTimeout(afterActionWait);
}

async function pasteColorInputText(window, container = window) {
  const textToPaste = await window.evaluate(() => navigator.clipboard.readText());
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
