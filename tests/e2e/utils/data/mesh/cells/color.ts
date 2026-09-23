import { cellsFeatureName, meshViewerObjectType } from "@tests/utils/constants";
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

async function setMeshCellsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, cellsFeatureName, percent);
}

async function setMeshCellsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, cellsFeatureName);
}

async function setMeshCellsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, cellsFeatureName);
}

function copyMeshCellsColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, cellsFeatureName);
}

function setMeshCellsColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, cellsFeatureName, colorText);
}

function pasteMeshCellsColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, cellsFeatureName, container);
}

async function setMeshCellsColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, cellsFeatureName, style);
}

export {
  copyMeshCellsColor,
  pasteMeshCellsColorInput,
  setMeshCellsColor,
  setMeshCellsColorInput,
  setMeshCellsColorWithSlider,
  setMeshCellsColoringStyle,
  setMeshCellsOpacity,
};
