import {
  meshViewerObjectType,
  polygonAttributeType,
  polygonsFeatureName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPolygonsVertexAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    vertexAttributeType,
    "points",
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

export { setMeshPolygonsVertexAttribute, setMeshPolygonsPolygonAttribute };
