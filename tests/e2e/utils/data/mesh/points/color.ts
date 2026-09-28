import type { Locator, Page } from "@playwright/test";
import { meshViewerObjectType, pointsFeatureName } from "@vease_tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@vease_tests/utils/data/helpers/color";

async function setMeshPointsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, pointsFeatureName, percent);
}

async function setMeshPointsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, pointsFeatureName);
}

async function setMeshPointsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, pointsFeatureName);
}

async function copyMeshPointsColor(window: Page): Promise<void> {
  await setFeatureCopyColor(window, meshViewerObjectType, pointsFeatureName);
}

async function setMeshPointsColorInput(window: Page, colorText: string): Promise<void> {
  await setFeatureColorInput(window, meshViewerObjectType, pointsFeatureName, colorText);
}

async function pasteMeshPointsColorInput(
  window: Page,
  container: Page | Locator = window,
): Promise<void> {
  await setFeaturePasteColorInput(window, meshViewerObjectType, pointsFeatureName, container);
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
