import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@vease_tests/utils/data/helpers/color_picker";
import {
  afterActionWait,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@vease_tests/utils/viewer_interaction";
import {
  meshViewerObjectType,
  pointsFeatureName,
  vertexAttributeType,
} from "@vease_tests/utils/constants";
import type { Page } from "@playwright/test";
import { setFeatureAttribute } from "@vease_tests/utils/data/helpers/attribute";

interface AttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

async function setMeshPointsVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    pointsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

async function openMeshPointsMenu(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${pointsFeatureName}Menu`;
  await openStyleMenu(window, menuTestId);
}

async function setMeshPointsNoDataColor(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${pointsFeatureName}Menu`;
  await ensureMenuOpen(window, menuTestId);
  const noDataColorBtn = window.getByTestId("noDataColorBtn").first();
  await noDataColorBtn.waitFor({ state: "visible" });
  await noDataColorBtn.click();
  await window.waitForTimeout(afterActionWait);
  await window
    .getByTestId("colorPicker")
    .filter({ visible: true })
    .first()
    .waitFor({ state: "visible" });
  await clickColorPickerSlider(window, SLIDER_PINK);
  await clickColorPickerCanvas(window);
  await noDataColorBtn.click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

export { openMeshPointsMenu, setMeshPointsNoDataColor, setMeshPointsVertexAttribute };
