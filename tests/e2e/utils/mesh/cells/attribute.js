import {
  cellAttributeType,
  cellsFeatureName,
  meshViewerObjectType,
  rgd2dAttributeName,
  rgd3dAttributeName,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

// Constants
const rgd2dAttribute = rgd2dAttributeName;
const rgd3dAttribute = rgd3dAttributeName;

function setMeshCellsVertexAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    vertexAttributeType,
    "points",
    options,
  );
}

function setMeshRegularGrid2DCellAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    cellAttributeType,
    rgd2dAttribute,
    options,
  );
}

function setMeshRegularGrid3DCellAttribute(window, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    cellsFeatureName,
    cellAttributeType,
    rgd3dAttribute,
    options,
  );
}

export {
  setMeshRegularGrid2DCellAttribute,
  setMeshRegularGrid3DCellAttribute,
  setMeshCellsVertexAttribute,
};
