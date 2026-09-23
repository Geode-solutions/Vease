import {
  copyColor,
  pasteColorInput,
  setColor,
  setColorInput,
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

async function copyModelPointsColor(window: Page): Promise<void> {
  await copyColor(window, "modelStyleMenu");
}

async function setModelPointsColorInput(window: Page, colorText: string): Promise<void> {
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelPointsColorInput(window: Page): Promise<void> {
  await pasteColorInput(window, "modelStyleMenu");
}

async function copyModelEdgesColor(window: Page): Promise<void> {
  await copyColor(window, "modelStyleMenu");
}

async function setModelEdgesColorInput(window: Page, colorText: string): Promise<void> {
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelEdgesColorInput(window: Page): Promise<void> {
  await pasteColorInput(window, "modelStyleMenu");
}

async function copyModelPolygonsColor(window: Page): Promise<void> {
  await copyColor(window, "modelStyleMenu");
}

async function setModelPolygonsColorInput(window: Page, colorText: string): Promise<void> {
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelPolygonsColorInput(window: Page): Promise<void> {
  await pasteColorInput(window, "modelStyleMenu");
}

async function copyModelPolyhedraColor(window: Page): Promise<void> {
  await copyColor(window, "modelStyleMenu");
}

async function setModelPolyhedraColorInput(window: Page, colorText: string): Promise<void> {
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelPolyhedraColorInput(window: Page): Promise<void> {
  await pasteColorInput(window, "modelStyleMenu");
}

export {
  copyModelEdgesColor,
  copyModelPointsColor,
  copyModelPolygonsColor,
  copyModelPolyhedraColor,
  pasteModelEdgesColorInput,
  pasteModelPointsColorInput,
  pasteModelPolygonsColorInput,
  pasteModelPolyhedraColorInput,
  setModelColor,
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelEdgesColorInput,
  setModelOpacity,
  setModelPointsColorInput,
  setModelPolygonsColorInput,
  setModelPolyhedraColorInput,
};
