import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/data/helpers/color_picker";
import {
  afterActionWait,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@tests/utils/viewer_interaction";
import {
  edgeAttributeType,
  edgesFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "@tests/utils/constants";
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

async function setMeshEdgesVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    edgesFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

async function setMeshEdgesEdgeAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    edgesFeatureName,
    edgeAttributeType,
    attributeName,
    options,
  );
}

async function setMeshEdgesItem(window: Page, item: number): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
  await setFeatureItem(window, menuTestId, item);
}

async function setMeshEdgesColorMap(window: Page, colorMap: string): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
  await setFeatureColorMap(window, menuTestId, colorMap);
}

async function openMeshEdgesMenu(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
  await openStyleMenu(window, menuTestId);
}

async function setMeshEdgesNoDataColor(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
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

export {
  openMeshEdgesMenu,
  setMeshEdgesColorMap,
  setMeshEdgesEdgeAttribute,
  setMeshEdgesItem,
  setMeshEdgesNoDataColor,
  setMeshEdgesVertexAttribute,
};
