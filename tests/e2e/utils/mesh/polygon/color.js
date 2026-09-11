import { meshViewerObjectType, polygonsFeatureName } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
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

function copyMeshPolygonsColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, polygonsFeatureName);
}

function setMeshPolygonsColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, polygonsFeatureName, colorText);
}

function pasteMeshPolygonsColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, polygonsFeatureName, container);
}

function setMeshPolygonsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, polygonsFeatureName, style);
}

export {
  copyMeshPolygonsColor,
  pasteMeshPolygonsColorInput,
  setMeshPolygonsColor,
  setMeshPolygonsColorInput,
  setMeshPolygonsColorWithSlider,
  setMeshPolygonsColoringStyle,
  setMeshPolygonsOpacity,
};
