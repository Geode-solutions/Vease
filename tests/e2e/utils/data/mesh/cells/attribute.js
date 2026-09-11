import {
  cellAttributeType,
  cellsFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "../../../constants.js";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "../../helpers/attribute.js";
import { openStyleMenu } from "../../../viewer_interaction.js";

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

export {
  openMeshCellsMenu,
  setMeshCellsCellAttribute,
  setMeshCellsVertexAttribute,
  setMeshCellsItem,
  setMeshCellsColorMap,
};
