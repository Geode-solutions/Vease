import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/helpers/color_picker.js";
import {
  afterActionWait,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@tests/utils/viewer_interaction.js";
import {
  edgeAttributeType,
  edgesFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "@tests/utils/helpers/attribute";

function setMeshEdgesVertexAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    edgesFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

function setMeshEdgesEdgeAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    edgesFeatureName,
    edgeAttributeType,
    attributeName,
    options,
  );
}

function setMeshEdgesItem(window, item) {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
  return setFeatureItem(window, menuTestId, item);
}

function setMeshEdgesColorMap(window, colorMap) {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
  return setFeatureColorMap(window, menuTestId, colorMap);
}

function openMeshEdgesMenu(window) {
  const menuTestId = `${meshViewerObjectType}${edgesFeatureName}Menu`;
  return openStyleMenu(window, menuTestId);
}

async function setMeshEdgesNoDataColor(window) {
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
  setMeshEdgesNoDataColor,
  setMeshEdgesVertexAttribute,
  setMeshEdgesEdgeAttribute,
  setMeshEdgesItem,
  setMeshEdgesColorMap,
};
