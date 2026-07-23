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

export {
  setMeshPolyhedraVertexAttribute,
  setMeshPolyhedraPolyhedronAttribute,
  setMeshPolyhedraItem,
  setMeshPolyhedraColorMap,
};
