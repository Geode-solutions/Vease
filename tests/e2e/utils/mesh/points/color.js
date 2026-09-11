import { meshViewerObjectType, pointsFeatureName } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
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

function copyMeshPointsColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, pointsFeatureName);
}

function setMeshPointsColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, pointsFeatureName, colorText);
}

function pasteMeshPointsColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, pointsFeatureName, container);
}

function setMeshPointsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, pointsFeatureName, style);
}

export {
  copyMeshPointsColor,
  pasteMeshPointsColorInput,
  setMeshPointsColor,
  setMeshPointsColorInput,
  setMeshPointsColorWithSlider,
  setMeshPointsColoringStyle,
  setMeshPointsOpacity,
};
