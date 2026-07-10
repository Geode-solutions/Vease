import { meshViewerObjectType, pointsFeatureName } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshPointsOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, pointsFeatureName, percent);
}

function setMeshPointsColor(window) {
  return setFeatureColor(window, meshViewerObjectType, pointsFeatureName);
}

function setMeshPointsColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, pointsFeatureName);
}

function setMeshPointsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, pointsFeatureName, style);
}

export {
  setMeshPointsColor,
  setMeshPointsColorWithSlider,
  setMeshPointsColoringStyle,
  setMeshPointsOpacity,
};
