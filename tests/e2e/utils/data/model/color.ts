import {
  copyColor,
  pasteColorInput,
  setColor,
  setColorInput,
  setColorWithSlider,
  setColoringStyle,
  setOpacity,
} from "@vease_tests/utils/data/helpers/color";
import type { Page } from "@playwright/test";
import { showModelStyleOptions } from "@vease_tests/utils/data/model/style_menu";

async function setModelOpacity(window: Page, percent: number): Promise<void> {
  await showModelStyleOptions(window);
  await setOpacity(window, "modelStyleMenu", percent);
}

async function setModelColor(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await setColor(window, "modelStyleMenu");
}

async function setModelColorWithSlider(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await setColorWithSlider(window, "modelStyleMenu");
}

async function setModelColoringStyle(window: Page, style: string): Promise<void> {
  await showModelStyleOptions(window);
  await setColoringStyle(window, "modelStyleMenu", style);
}

async function copyModelPointsColor(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await copyColor(window, "modelStyleMenu");
}

async function setModelPointsColorInput(window: Page, colorText: string): Promise<void> {
  await showModelStyleOptions(window);
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelPointsColorInput(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await pasteColorInput(window, "modelStyleMenu");
}

async function copyModelEdgesColor(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await copyColor(window, "modelStyleMenu");
}

async function setModelEdgesColorInput(window: Page, colorText: string): Promise<void> {
  await showModelStyleOptions(window);
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelEdgesColorInput(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await pasteColorInput(window, "modelStyleMenu");
}

async function copyModelPolygonsColor(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await copyColor(window, "modelStyleMenu");
}

async function setModelPolygonsColorInput(window: Page, colorText: string): Promise<void> {
  await showModelStyleOptions(window);
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelPolygonsColorInput(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await pasteColorInput(window, "modelStyleMenu");
}

async function copyModelPolyhedraColor(window: Page): Promise<void> {
  await showModelStyleOptions(window);
  await copyColor(window, "modelStyleMenu");
}

async function setModelPolyhedraColorInput(window: Page, colorText: string): Promise<void> {
  await showModelStyleOptions(window);
  await setColorInput(window, "modelStyleMenu", colorText);
}

async function pasteModelPolyhedraColorInput(window: Page): Promise<void> {
  await showModelStyleOptions(window);
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
