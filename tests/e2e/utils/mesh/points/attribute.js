import {
  meshViewerObjectType,
  pointsFeatureName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPointsVertexAttribute(window, attributeName = "points", options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    pointsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

export { setMeshPointsVertexAttribute };
