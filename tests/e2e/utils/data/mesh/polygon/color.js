<<<<<<<< HEAD:tests/e2e/utils/data/mesh/polygon/color.js
import { meshViewerObjectType, polygonsFeatureName } from "vease/tests/e2e/utils/constants.js";
========
import { meshViewerObjectType, polygonsFeatureName } from "@tests/utils/constants";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/mesh/polygon/color.ts
import {
  setFeatureColor,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "vease/tests/e2e/utils/data/helpers/color.js";

function setMeshPolygonsOpacity(window, percent) {
  return setFeatureOpacity(window, meshViewerObjectType, polygonsFeatureName, percent);
}

function setMeshPolygonsColor(window) {
  return setFeatureColor(window, meshViewerObjectType, polygonsFeatureName);
}

function setMeshPolygonsColorWithSlider(window) {
  return setFeatureColorWithSlider(window, meshViewerObjectType, polygonsFeatureName);
}

function setMeshPolygonsColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, polygonsFeatureName, style);
}

export {
  setMeshPolygonsColor,
  setMeshPolygonsColoringStyle,
  setMeshPolygonsColorWithSlider,
  setMeshPolygonsOpacity,
};
