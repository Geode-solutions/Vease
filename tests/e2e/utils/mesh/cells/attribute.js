import {
  cellAttributeType,
  cellsFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
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

export {
  setMeshCellsCellAttribute,
  setMeshCellsVertexAttribute,
  setMeshCellsItem,
  setMeshCellsColorMap,
};
