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

export {
  setMeshPolygonsVertexAttribute,
  setMeshPolygonsPolygonAttribute,
  setMeshPolygonsItem,
  setMeshPolygonsColorMap,
};
