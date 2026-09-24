import type { Locator, Page } from "@playwright/test";
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

async function setMeshCellsOpacity(window: Page, percent: number): Promise<void> {
  await setFeatureOpacity(window, meshViewerObjectType, cellsFeatureName, percent);
}

async function setMeshCellsColor(window: Page): Promise<void> {
  await setFeatureColor(window, meshViewerObjectType, cellsFeatureName);
}

async function setMeshCellsColorWithSlider(window: Page): Promise<void> {
  await setFeatureColorWithSlider(window, meshViewerObjectType, cellsFeatureName);
}

async function copyMeshCellsColor(window: Page): Promise<void> {
  await setFeatureCopyColor(window, meshViewerObjectType, cellsFeatureName);
}

async function setMeshCellsColorInput(window: Page, colorText: string): Promise<void> {
  await setFeatureColorInput(window, meshViewerObjectType, cellsFeatureName, colorText);
}

async function pasteMeshCellsColorInput(
  window: Page,
  container: Page | Locator = window,
): Promise<void> {
  await setFeaturePasteColorInput(window, meshViewerObjectType, cellsFeatureName, container);
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
