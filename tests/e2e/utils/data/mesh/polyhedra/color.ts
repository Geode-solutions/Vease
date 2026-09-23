import { meshViewerObjectType, polyhedraFeatureName } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorBlack,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@tests/utils/data/helpers/color";
import type { Page } from "@playwright/test";

async function setMeshPolyhedraOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, polyhedraFeatureName, percent);
}

async function setMeshPolyhedraColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, polyhedraFeatureName);
}

async function setMeshPolyhedraColorBlack(window: Page): Promise<void> {
  await setFeatureColorBlack(window, meshViewerObjectType, polyhedraFeatureName);
}

async function setMeshPolyhedraColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, polyhedraFeatureName);
}

function copyMeshPolyhedraColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, polyhedraFeatureName);
}

function setMeshPolyhedraColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, polyhedraFeatureName, colorText);
}

function pasteMeshPolyhedraColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, polyhedraFeatureName, container);
}

async function setMeshPolyhedraColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, polyhedraFeatureName, style);
}

export {
  copyMeshPolyhedraColor,
  pasteMeshPolyhedraColorInput,
  setMeshPolyhedraColor,
  setMeshPolyhedraColorBlack,
  setMeshPolyhedraColorInput,
  setMeshPolyhedraColorWithSlider,
  setMeshPolyhedraColoringStyle,
  setMeshPolyhedraOpacity,
};
