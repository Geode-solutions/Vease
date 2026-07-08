import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshEdgesOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Edges", percent);
}

function setMeshEdgesColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Edges");
}

function setMeshEdgesColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Edges");
}

function setMeshEdgesColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Edges", style);
}

export {
  setMeshEdgesOpacity,
  setMeshEdgesColor,
  setMeshEdgesColorWithSlider,
  setMeshEdgesColoringStyle,
};
