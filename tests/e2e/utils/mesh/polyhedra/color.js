import { meshViewerObjectType, polyhedraFeatureName } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorBlack,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@tests/utils/helpers/color.js";

function setMeshPolyhedraOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, polyhedraFeatureName, percent);
}

function setMeshPolyhedraColor(window) {
  return setFeatureColor(window, meshViewerObjectType, polyhedraFeatureName);
}

function setMeshPolyhedraColorBlack(window) {
  return setFeatureColorBlack(window, meshViewerObjectType, polyhedraFeatureName);
}

function setMeshPolyhedraColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, polyhedraFeatureName);
}

function copyMeshPolyhedraColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, polyhedraFeatureName);
}

function setMeshPolyhedraColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, polyhedraFeatureName, colorText);
}

function pasteMeshPolyhedraColorInput(window, colorText) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, polyhedraFeatureName, colorText);
}

function setMeshPolyhedraColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, polyhedraFeatureName, style);
}

export {
  copyMeshPolyhedraColor,
  pasteMeshPolyhedraColorInput,
  setMeshPolyhedraColor,
  setMeshPolyhedraColorBlack,
  setMeshPolyhedraColorInput,
  setMeshPolyhedraColorWithSlider,
  setMeshPolyhedraColoringStyle,
  setMeshPolyhedraOpacity,
};
