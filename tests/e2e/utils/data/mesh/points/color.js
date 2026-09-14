import { meshViewerObjectType, pointsFeatureName } from "vease/tests/e2e/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "vease/tests/e2e/utils/data/helpers/color.js";

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
