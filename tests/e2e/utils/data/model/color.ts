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

function copyModelPointsColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelPointsColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelPointsColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

function copyModelEdgesColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelEdgesColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelEdgesColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

function copyModelPolygonsColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelPolygonsColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelPolygonsColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

function copyModelPolyhedraColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelPolyhedraColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelPolyhedraColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
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
