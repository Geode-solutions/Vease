import type { Locator, Page } from "@playwright/test";
import { edgesFeatureName, meshViewerObjectType } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@tests/utils/data/helpers/color";

async function setMeshEdgesOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, edgesFeatureName, percent);
}

async function setMeshEdgesColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, edgesFeatureName);
}

async function setMeshEdgesColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, edgesFeatureName);
}

async function copyMeshEdgesColor(window: Page): Promise<void> {
  await setFeatureCopyColor(window, meshViewerObjectType, edgesFeatureName);
}

async function setMeshEdgesColorInput(window: Page, colorText: string): Promise<void> {
  await setFeatureColorInput(window, meshViewerObjectType, edgesFeatureName, colorText);
}

async function pasteMeshEdgesColorInput(
  window: Page,
  container: Page | Locator = window,
): Promise<void> {
  await setFeaturePasteColorInput(window, meshViewerObjectType, edgesFeatureName, container);
}

async function setMeshEdgesColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, edgesFeatureName, style);
}

export {
  setMeshEdgesOpacity,
  setMeshEdgesColor,
  setMeshEdgesColorWithSlider,
  copyMeshEdgesColor,
  setMeshEdgesColorInput,
  pasteMeshEdgesColorInput,
  setMeshEdgesColoringStyle,
};
