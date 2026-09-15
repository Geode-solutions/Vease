<<<<<<<< HEAD:tests/e2e/utils/data/mesh/edges/color.js
import { edgesFeatureName, meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
========
import { edgesFeatureName, meshViewerObjectType } from "@tests/utils/constants";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/mesh/edges/color.ts
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "vease/tests/e2e/utils/data/helpers/color.js";

function setMeshEdgesOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, edgesFeatureName, percent);
}

function setMeshEdgesColor(window) {
  return setFeatureColor(window, meshViewerObjectType, edgesFeatureName);
}

function setMeshEdgesColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, edgesFeatureName);
}

function setMeshEdgesColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, edgesFeatureName, style);
}

export {
  setMeshEdgesOpacity,
  setMeshEdgesColor,
  setMeshEdgesColorWithSlider,
  setMeshEdgesColoringStyle,
};
