import { edgesFeatureName, meshViewerObjectType } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/data/helpers/color";
import type { Page } from "@playwright/test";

async function setMeshEdgesOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, edgesFeatureName, percent);
}

async function setMeshEdgesColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, edgesFeatureName);
}

async function setMeshEdgesColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, edgesFeatureName);
}

async function setMeshEdgesColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, edgesFeatureName, style);
}

export {
  setMeshEdgesOpacity,
  setMeshEdgesColor,
  setMeshEdgesColorWithSlider,
  setMeshEdgesColoringStyle,
};
