import { meshViewerObjectType, polygonsFeatureName } from "@tests/utils/constants";
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

async function setMeshPolygonsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, polygonsFeatureName, percent);
}

async function setMeshPolygonsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, polygonsFeatureName);
}

async function setMeshPolygonsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, polygonsFeatureName);
}

function copyMeshPolygonsColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, polygonsFeatureName);
}

function setMeshPolygonsColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, polygonsFeatureName, colorText);
}

function pasteMeshPolygonsColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, polygonsFeatureName, container);
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
