import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/helpers/color_picker";
import {
  afterActionWait,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@tests/utils/viewer_interaction";
import {
  cellAttributeType,
  cellsFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "@tests/utils/constants";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "@tests/utils/helpers/attribute";

function setMeshCellsVertexAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

function setMeshCellsCellAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    cellAttributeType,
    attributeName,
    options,
  );
}

function setMeshCellsItem(window, item) {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  return setFeatureItem(window, menuTestId, item);
}

function setMeshCellsColorMap(window, colorMap) {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  return setFeatureColorMap(window, menuTestId, colorMap);
}

function openMeshCellsMenu(window) {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
  return openStyleMenu(window, menuTestId);
}

async function setMeshCellsNoDataColor(window) {
  const menuTestId = `${meshViewerObjectType}${cellsFeatureName}Menu`;
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
  openMeshCellsMenu,
  setMeshCellsNoDataColor,
  setMeshCellsCellAttribute,
  setMeshCellsVertexAttribute,
  setMeshCellsItem,
  setMeshCellsColorMap,
};
