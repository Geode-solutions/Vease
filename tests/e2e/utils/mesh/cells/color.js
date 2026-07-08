import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "@tests/utils/helpers/color";

function setMeshCellsOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Cells", percent);
}

function setMeshCellsColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Cells");
}

function setMeshCellsColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Cells");
}

function setMeshCellsColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Cells", style);
}

export {
  setMeshCellsColor,
  setMeshCellsColorWithSlider,
  setMeshCellsColoringStyle,
  setMeshCellsOpacity,
};
