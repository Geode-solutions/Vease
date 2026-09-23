import { meshViewerObjectType, pointsFeatureName } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
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

async function setMeshPointsColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, pointsFeatureName, style);
}

export {
  setMeshPointsColor,
  setMeshPointsColorWithSlider,
  setMeshPointsColoringStyle,
  setMeshPointsOpacity,
};
