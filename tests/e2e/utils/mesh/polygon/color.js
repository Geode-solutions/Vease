import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshPolygonsOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Polygons", percent);
}

function setMeshPolygonsColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Polygons");
}

function setMeshPolygonsColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Polygons");
}

function setMeshPolygonsColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Polygons", style);
}

export {
  setMeshPolygonsColor,
  setMeshPolygonsColoringStyle,
  setMeshPolygonsColorWithSlider,
  setMeshPolygonsOpacity,
};
