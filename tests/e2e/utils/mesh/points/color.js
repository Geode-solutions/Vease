import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshPointsOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Points", percent);
}

function setMeshPointsColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Points");
}

function setMeshPointsColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Points");
}

function setMeshPointsColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Points", style);
}

export {
  setMeshPointsColor,
  setMeshPointsColorWithSlider,
  setMeshPointsColoringStyle,
  setMeshPointsOpacity,
};
