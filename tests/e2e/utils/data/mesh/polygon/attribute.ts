import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@vease_tests/utils/data/helpers/color_picker";
import {
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@vease_tests/utils/viewer_interaction";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";
import {
  meshViewerObjectType,
  polygonAttributeType,
  polygonsFeatureName,
  vertexAttributeType,
} from "@vease_tests/utils/constants";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "@vease_tests/utils/data/helpers/attribute";
import type { Page } from "@playwright/test";

interface AttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

async function setMeshPolygonsVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

async function setMeshPolygonsPolygonAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    polygonAttributeType,
    attributeName,
    options,
  );
}

async function setMeshPolygonsItem(window: Page, item: number): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
  await setFeatureItem(window, menuTestId, item);
}

async function setMeshPolygonsColorMap(window: Page, colorMap: string): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
  await setFeatureColorMap(window, menuTestId, colorMap);
}

async function openMeshPolygonsMenu(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
  await openStyleMenu(window, menuTestId);
}

async function setMeshPolygonsNoDataColor(window: Page): Promise<void> {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
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
  openMeshPolygonsMenu,
  setMeshPolygonsColorMap,
  setMeshPolygonsItem,
  setMeshPolygonsNoDataColor,
  setMeshPolygonsPolygonAttribute,
  setMeshPolygonsVertexAttribute,
};
