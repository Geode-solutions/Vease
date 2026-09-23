import { meshViewerObjectType, polygonsFeatureName } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/data/helpers/color";
import type { Page } from "@playwright/test";

async function setMeshPolygonsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, polygonsFeatureName, percent);
}

async function setMeshPolygonsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, polygonsFeatureName);
}

async function setMeshPolygonsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, polygonsFeatureName);
}

async function setMeshPolygonsColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, polygonsFeatureName, style);
}

export {
  setMeshPolygonsColor,
  setMeshPolygonsColoringStyle,
  setMeshPolygonsColorWithSlider,
  setMeshPolygonsOpacity,
};
