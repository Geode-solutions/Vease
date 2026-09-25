import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/data/helpers/color_picker";
import {
  cellAttributeType,
  cellsFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "@tests/utils/constants";
import {
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
  waitForActionSettled,
} from "@tests/utils/viewer_interaction";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "@tests/utils/data/helpers/attribute";
import type { Page } from "@playwright/test";

interface AttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

async function setMeshCellsVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

async function setMeshCellsCellAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    cellAttributeType,
    attributeName,
    options,
  );
}

async function setMeshCellsItem(window: Page, item: number): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  await setFeatureItem(window, menuTestId, item);
}

async function setMeshCellsColorMap(window: Page, colorMap: string): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  await setFeatureColorMap(window, menuTestId, colorMap);
}

async function openMeshCellsMenu(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  await openStyleMenu(window, menuTestId);
}

async function setMeshCellsNoDataColor(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  await ensureMenuOpen(window, menuTestId);
  const noDataColorBtn = window.getByTestId("noDataColorBtn").first();
  await noDataColorBtn.waitFor({ state: "visible" });
  await noDataColorBtn.click();
  await waitForActionSettled(window);
  await window
    .getByTestId("colorPicker")
    .filter({ visible: true })
    .first()
    .waitFor({ state: "visible" });
  await clickColorPickerSlider(window, SLIDER_PINK);
  await clickColorPickerCanvas(window);
  await noDataColorBtn.click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

export {
  openMeshCellsMenu,
  setMeshCellsCellAttribute,
  setMeshCellsColorMap,
  setMeshCellsItem,
  setMeshCellsNoDataColor,
  setMeshCellsVertexAttribute,
};
