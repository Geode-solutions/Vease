import {
  meshViewerObjectType,
  polygonAttributeType,
  polygonalSurfaceAttributeName,
  polygonsFeatureName,
  triangulatedSurfaceAttributeName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

// Constants
const polygonalAttribute = polygonalSurfaceAttributeName;
const triangulatedAttribute = triangulatedSurfaceAttributeName;

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

function setMeshPolygonalSurfacePolygonAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    polygonAttributeType,
    polygonalAttribute,
    options,
  );
}

function setMeshTriangulatedSurfacePolygonAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polygonsFeatureName,
    polygonAttributeType,
    triangulatedAttribute,
    options,
  );
}

export {
  setMeshPolygonsVertexAttribute,
  setMeshPolygonalSurfacePolygonAttribute,
  setMeshTriangulatedSurfacePolygonAttribute,
};
