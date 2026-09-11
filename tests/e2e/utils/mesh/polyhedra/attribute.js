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
  meshViewerObjectType,
  polyhedraFeatureName,
  polyhedronAttributeType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "@tests/utils/helpers/attribute";

function setMeshPolyhedraVertexAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

function setMeshPolyhedraPolyhedronAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    polyhedronAttributeType,
    attributeName,
    options,
  );
}

function setMeshPolyhedraItem(window, item) {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
  return setFeatureItem(window, menuTestId, item);
}

function setMeshPolyhedraColorMap(window, colorMap) {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
  return setFeatureColorMap(window, menuTestId, colorMap);
}

function openMeshPolyhedraMenu(window) {
  const menuTestId = `${meshViewerObjectType}${polyhedraFeatureName}Menu`;
  return openStyleMenu(window, menuTestId);
}

async function setMeshPolyhedraNoDataColor(window) {
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
  setMeshPolyhedraNoDataColor,
  setMeshPolyhedraVertexAttribute,
  setMeshPolyhedraPolyhedronAttribute,
  setMeshPolyhedraItem,
  setMeshPolyhedraColorMap,
};
