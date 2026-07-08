import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshPolyhedraOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Polyhedra", percent);
}

function setMeshPolyhedraColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Polyhedra");
}

function setMeshPolyhedraColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Polyhedra");
}

function setMeshPolyhedraColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Polyhedra", style);
}

export {
  setMeshPolyhedraColor,
  setMeshPolyhedraColorWithSlider,
  setMeshPolyhedraColoringStyle,
  setMeshPolyhedraOpacity,
};
