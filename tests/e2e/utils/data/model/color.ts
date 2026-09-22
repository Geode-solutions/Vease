import {
  setColor,
  setColorWithSlider,
  setColoringStyle,
  setOpacity,
} from "@tests/utils/data/helpers/color";
import type { Page } from "@playwright/test";

async function setModelOpacity(window: Page, percent: number): Promise<void> {
  await setOpacity(window, "modelStyleMenu", percent);
}

async function setModelColor(window: Page): Promise<void> {
  await setColor(window, "modelStyleMenu");
}

async function setModelColorWithSlider(window: Page): Promise<void> {
  await setColorWithSlider(window, "modelStyleMenu");
}

async function setModelColoringStyle(window: Page, style: string): Promise<void> {
  await setColoringStyle(window, "modelStyleMenu", style);
}

export { setModelColor, setModelColorWithSlider, setModelColoringStyle, setModelOpacity };
