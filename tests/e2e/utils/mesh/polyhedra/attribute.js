import {
  hybridSolidAttributeName,
  meshViewerObjectType,
  polyhedraFeatureName,
  polyhedronAttributeType,
  tetrahedralSolidAttributeName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

// Constants
const hybridAttribute = hybridSolidAttributeName;
const tetrahedralAttribute = tetrahedralSolidAttributeName;

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

function setMeshHybridSolidPolyhedronAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    polyhedronAttributeType,
    hybridAttribute,
    options,
  );
}

function setMeshTetrahedralSolidPolyhedronAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    polyhedraFeatureName,
    polyhedronAttributeType,
    tetrahedralAttribute,
    options,
  );
}

export {
  setMeshPolyhedraVertexAttribute,
  setMeshHybridSolidPolyhedronAttribute,
  setMeshTetrahedralSolidPolyhedronAttribute,
};
