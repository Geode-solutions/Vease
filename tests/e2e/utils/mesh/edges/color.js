import { edgesFeatureName, meshViewerObjectType } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshEdgesOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, edgesFeatureName, percent);
}

function setMeshEdgesColor(window) {
  return setFeatureColor(window, meshViewerObjectType, edgesFeatureName);
}

function setMeshEdgesColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, edgesFeatureName);
}

function setMeshEdgesColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, edgesFeatureName, style);
}

export {
  setMeshEdgesOpacity,
  setMeshEdgesColor,
  setMeshEdgesColorWithSlider,
  setMeshEdgesColoringStyle,
};
