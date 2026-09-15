<<<<<<<< HEAD:tests/e2e/utils/data/mesh/polyhedra/color.js
import { meshViewerObjectType, polyhedraFeatureName } from "vease/tests/e2e/utils/constants.js";
========
import { meshViewerObjectType, polyhedraFeatureName } from "@tests/utils/constants";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/mesh/polyhedra/color.ts
import {
  setFeatureColor,
  setFeatureColorBlack,
  setFeatureColorWithSlider,
  setFeatureColoringStyle,
  setFeatureOpacity,
} from "vease/tests/e2e/utils/data/helpers/color.js";

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

function setMeshPolyhedraColoringStyle(window, style) {
  return setFeatureColoringStyle(window, meshViewerObjectType, polyhedraFeatureName, style);
}

export {
  setMeshPolyhedraColor,
  setMeshPolyhedraColorBlack,
  setMeshPolyhedraColorWithSlider,
  setMeshPolyhedraColoringStyle,
  setMeshPolyhedraOpacity,
};
