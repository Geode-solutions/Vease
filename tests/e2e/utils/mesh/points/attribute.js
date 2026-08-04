import {
  meshViewerObjectType,
  pointsFeatureName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { openStyleMenu } from "@tests/utils/viewer_interaction.js";
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

function openMeshPointsMenu(window) {
  const menuTestId = `${meshViewerObjectType}${pointsFeatureName}Menu`;
  return openStyleMenu(window, menuTestId);
}

export { openMeshPointsMenu, setMeshPointsVertexAttribute };
