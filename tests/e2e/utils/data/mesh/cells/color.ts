import { cellsFeatureName, meshViewerObjectType } from "@tests/utils/constants";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
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

async function setMeshCellsColoringStyle(window: Page, style: string): Promise<void> {
  await setFeatureColoringStyle(window, meshViewerObjectType, cellsFeatureName, style);
}

export {
  setMeshCellsColor,
  setMeshCellsColorWithSlider,
  setMeshCellsColoringStyle,
  setMeshCellsOpacity,
};
