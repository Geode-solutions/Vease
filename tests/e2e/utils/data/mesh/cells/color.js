<<<<<<<< HEAD:tests/e2e/utils/data/mesh/cells/color.js
import { cellsFeatureName, meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
========
import { cellsFeatureName, meshViewerObjectType } from "@tests/utils/constants";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/mesh/cells/color.ts
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "vease/tests/e2e/utils/data/helpers/color.js";

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
