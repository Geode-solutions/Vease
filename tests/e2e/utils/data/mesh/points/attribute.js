import {
  meshViewerObjectType,
  pointsFeatureName,
  vertexAttributeType,
} from "../../../constants.js";
import { openStyleMenu } from "../../../viewer_interaction.js";
import { setFeatureAttribute } from "../../helpers/attribute.js";

function setMeshPointsVertexAttribute(window, attributeName, options = {}) {
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
