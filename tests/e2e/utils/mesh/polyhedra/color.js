import { meshViewerObjectType, polyhedraFeatureName } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshPolyhedraOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, polyhedraFeatureName, percent);
}

function setMeshPolyhedraColor(window) {
  return setFeatureColor(window, meshViewerObjectType, polyhedraFeatureName);
}

function setMeshPolyhedraColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, polyhedraFeatureName);
}

function setMeshPolyhedraColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, polyhedraFeatureName, style);
}

export {
  setMeshPolyhedraColor,
  setMeshPolyhedraColorWithSlider,
  setMeshPolyhedraColoringStyle,
  setMeshPolyhedraOpacity,
};
