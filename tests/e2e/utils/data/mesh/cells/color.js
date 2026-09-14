import { cellsFeatureName, meshViewerObjectType } from "@tests/utils/data/constants.js";
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/data/helpers/color.js";

function setMeshCellsOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, cellsFeatureName, percent);
}

function setMeshCellsColor(window) {
  return setFeatureColor(window, meshViewerObjectType, cellsFeatureName);
}

function setMeshCellsColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, cellsFeatureName);
}

function setMeshCellsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, cellsFeatureName, style);
}

export {
  setMeshCellsColor,
  setMeshCellsColorWithSlider,
  setMeshCellsColoringStyle,
  setMeshCellsOpacity,
};
