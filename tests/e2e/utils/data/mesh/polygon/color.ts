import type { Locator, Page } from "@playwright/test";
import { meshViewerObjectType, polygonsFeatureName } from "@vease_tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@vease_tests/utils/data/helpers/color";

async function setMeshPolygonsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, polygonsFeatureName, percent);
}

async function setMeshPolygonsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, polygonsFeatureName);
}

async function setMeshPolygonsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, polygonsFeatureName);
}

async function copyMeshPolygonsColor(window: Page): Promise<void> {
  await setFeatureCopyColor(window, meshViewerObjectType, polygonsFeatureName);
}

async function setMeshPolygonsColorInput(window: Page, colorText: string): Promise<void> {
  await setFeatureColorInput(window, meshViewerObjectType, polygonsFeatureName, colorText);
}

async function pasteMeshPolygonsColorInput(
  window: Page,
  container: Page | Locator = window,
): Promise<void> {
  await setFeaturePasteColorInput(window, meshViewerObjectType, polygonsFeatureName, container);
}

async function setMeshPolygonsColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, polygonsFeatureName, style);
}

export {
  copyMeshPolygonsColor,
  pasteMeshPolygonsColorInput,
  setMeshPolygonsColor,
  setMeshPolygonsColorInput,
  setMeshPolygonsColorWithSlider,
  setMeshPolygonsColoringStyle,
  setMeshPolygonsOpacity,
};
