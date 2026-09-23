import { meshViewerObjectType, pointsFeatureName } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@tests/utils/data/helpers/color";
import type { Page } from "@playwright/test";

async function setMeshPointsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, pointsFeatureName, percent);
}

async function setMeshPointsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, pointsFeatureName);
}

async function setMeshPointsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, pointsFeatureName);
}

function copyMeshPointsColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, pointsFeatureName);
}

function setMeshPointsColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, pointsFeatureName, colorText);
}

function pasteMeshPointsColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, pointsFeatureName, container);
}

async function setMeshPointsColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, pointsFeatureName, style);
}

export {
  copyMeshPointsColor,
  pasteMeshPointsColorInput,
  setMeshPointsColor,
  setMeshPointsColorInput,
  setMeshPointsColorWithSlider,
  setMeshPointsColoringStyle,
  setMeshPointsOpacity,
};
