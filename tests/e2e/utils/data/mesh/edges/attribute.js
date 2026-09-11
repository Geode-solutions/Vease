import {
  edgeAttributeType,
  edgesFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "../../../constants.js";
import {
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
} from "../../helpers/attribute.js";
import { openStyleMenu } from "../../../viewer_interaction.js";

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

export {
  openMeshEdgesMenu,
  setMeshEdgesVertexAttribute,
  setMeshEdgesEdgeAttribute,
  setMeshEdgesItem,
  setMeshEdgesColorMap,
};
