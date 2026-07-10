import {
  edgeAttributeType,
  edgedCurveAttributeName,
  edgesFeatureName,
  meshViewerObjectType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

// Constants
const attributeName = edgedCurveAttributeName;

function setMeshEdgesVertexAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    edgesFeatureName,
    vertexAttributeType,
    "points",
    options,
  );
}

function setMeshEdgesEdgeAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    edgesFeatureName,
    edgeAttributeType,
    attributeName,
    options,
  );
}

export { setMeshEdgesVertexAttribute, setMeshEdgesEdgeAttribute };
