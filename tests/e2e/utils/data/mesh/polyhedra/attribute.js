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
import { openStyleMenu } from "@tests/utils/viewer_interaction.js";

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

export {
  openMeshPolyhedraMenu,
  setMeshPolyhedraVertexAttribute,
  setMeshPolyhedraPolyhedronAttribute,
  setMeshPolyhedraItem,
  setMeshPolyhedraColorMap,
};
