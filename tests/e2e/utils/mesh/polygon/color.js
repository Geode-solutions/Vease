import { meshViewerObjectType, polygonsFeatureName } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshPolygonsOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, polygonsFeatureName, percent);
}

function setMeshPolygonsColor(window) {
  return setFeatureColor(window, meshViewerObjectType, polygonsFeatureName);
}

function setMeshPolygonsColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, polygonsFeatureName);
}

function setMeshPolygonsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, polygonsFeatureName, style);
}

export {
  setMeshPolygonsColor,
  setMeshPolygonsColoringStyle,
  setMeshPolygonsColorWithSlider,
  setMeshPolygonsOpacity,
};
