import { cellsFeatureName, meshViewerObjectType } from "@tests/utils/constants.js";
import {
  setFeatureColor,
  setFeatureColorInput,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureCopyColor,
  setFeatureOpacity,
  setFeaturePasteColorInput,
} from "@tests/utils/helpers/color";

function setMeshCellsOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, cellsFeatureName, percent);
}

function setMeshCellsColor(window) {
  return setFeatureColor(window, meshViewerObjectType, cellsFeatureName);
}

function setMeshCellsColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, cellsFeatureName);
}

function copyMeshCellsColor(window) {
  return setFeatureCopyColor(window, meshViewerObjectType, cellsFeatureName);
}

function setMeshCellsColorInput(window, colorText) {
  return setFeatureColorInput(window, meshViewerObjectType, cellsFeatureName, colorText);
}

function pasteMeshCellsColorInput(window, container = window) {
  return setFeaturePasteColorInput(window, meshViewerObjectType, cellsFeatureName, container);
}

function setMeshCellsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, cellsFeatureName, style);
}

export {
  copyMeshCellsColor,
  pasteMeshCellsColorInput,
  setMeshCellsColor,
  setMeshCellsColorInput,
  setMeshCellsColorWithSlider,
  setMeshCellsColoringStyle,
  setMeshCellsOpacity,
};
