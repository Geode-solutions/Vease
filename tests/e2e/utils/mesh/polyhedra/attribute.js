import {
  meshViewerObjectType,
  polyhedraFeatureName,
  polyhedronAttributeType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPolyhedraVertexAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    vertexAttributeType,
    "points",
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

export { setMeshPolyhedraVertexAttribute, setMeshPolyhedraPolyhedronAttribute };
