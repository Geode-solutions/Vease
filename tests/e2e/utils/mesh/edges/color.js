import { edgesFeatureName, meshViewerObjectType } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
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

function copyMeshEdgesColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, edgesFeatureName);
}

function setMeshEdgesColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, edgesFeatureName, colorText);
}

function pasteMeshEdgesColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, edgesFeatureName, container);
}

function setMeshEdgesColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, edgesFeatureName, style);
}

export {
  setMeshEdgesOpacity,
  setMeshEdgesColor,
  setMeshEdgesColorWithSlider,
  copyMeshEdgesColor,
  setMeshEdgesColorInput,
  pasteMeshEdgesColorInput,
  setMeshEdgesColoringStyle,
};
