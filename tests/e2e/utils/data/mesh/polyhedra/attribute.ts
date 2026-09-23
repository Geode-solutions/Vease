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
  meshViewerObjectType,
  polyhedraFeatureName,
  polyhedronAttributeType,
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

async function setMeshPolyhedraVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

async function setMeshPolyhedraPolyhedronAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    polyhedronAttributeType,
    attributeName,
    options,
  );
}

async function setMeshPolyhedraItem(window: Page, item: number): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
  await setFeatureItem(window, menuTestId, item);
}

async function setMeshPolyhedraColorMap(window: Page, colorMap: string): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
  await setFeatureColorMap(window, menuTestId, colorMap);
}

async function openMeshPolyhedraMenu(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
  await openStyleMenu(window, menuTestId);
}

async function setMeshPolyhedraNoDataColor(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
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
  openMeshPolyhedraMenu,
  setMeshPolyhedraColorMap,
  setMeshPolyhedraItem,
  setMeshPolyhedraNoDataColor,
  setMeshPolyhedraPolyhedronAttribute,
  setMeshPolyhedraVertexAttribute,
};
