import {
  afterActionWait,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/helpers/color_picker.js";
import {
  meshViewerObjectType,
  polygonAttributeType,
  polygonsFeatureName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "@tests/utils/helpers/attribute";

function setMeshPolygonsVertexAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

function setMeshPolygonsPolygonAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    polygonAttributeType,
    attributeName,
    options,
  );
}

function setMeshPolygonsItem(window, item) {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
  return setFeatureItem(window, menuTestId, item);
}

function setMeshPolygonsColorMap(window, colorMap) {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
  return setFeatureColorMap(window, menuTestId, colorMap);
}

function openMeshPolygonsMenu(window) {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
  return openStyleMenu(window, menuTestId);
}

async function setMeshPolygonsNoDataColor(window) {
  const menuTestId = `${meshViewerObjectType}${polygonsFeatureName}Menu`;
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
  await clickColorPickerSlider(window);
  await clickColorPickerCanvas(window);
  await noDataColorBtn.click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

export {
  openMeshPolygonsMenu,
  setMeshPolygonsNoDataColor,
  setMeshPolygonsVertexAttribute,
  setMeshPolygonsPolygonAttribute,
  setMeshPolygonsItem,
  setMeshPolygonsColorMap,
};
