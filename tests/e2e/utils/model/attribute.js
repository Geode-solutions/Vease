import {
  cellAttributeType,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { applyAttribute, setFeatureNoDataColor } from "@tests/utils/helpers/attribute.js";

function setModelPointsVertexAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPointsVertexAttributeNoDataColor(window) {
  return setFeatureNoDataColor(window, "modelStyleMenu");
}

function setModelEdgesVertexAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelEdgesVertexAttributeNoDataColor(window) {
  return setFeatureNoDataColor(window, "modelStyleMenu");
}

function setModelPolygonsVertexAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPolygonsVertexAttributeNoDataColor(window) {
  return setFeatureNoDataColor(window, "modelStyleMenu");
}

function setModelPolyhedraVertexAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPolyhedraVertexAttributeNoDataColor(window) {
  return setFeatureNoDataColor(window, "modelStyleMenu");
}

function setModelCellsVertexAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelCellsVertexAttributeNoDataColor(window) {
  return setFeatureNoDataColor(window, "modelStyleMenu");
}

function setModelEdgesEdgeAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: edgeAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPolygonsPolygonAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: polygonAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPolyhedraPolyhedronAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: polyhedronAttributeType,
    attributeName,
    ...options,
  });
}

function setModelCellsCellAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: cellAttributeType,
    attributeName,
    ...options,
  });
}

export {
  setModelCellsCellAttribute,
  setModelCellsVertexAttribute,
  setModelCellsVertexAttributeNoDataColor,
  setModelEdgesEdgeAttribute,
  setModelEdgesVertexAttribute,
  setModelEdgesVertexAttributeNoDataColor,
  setModelPointsVertexAttribute,
  setModelPointsVertexAttributeNoDataColor,
  setModelPolygonsPolygonAttribute,
  setModelPolygonsVertexAttribute,
  setModelPolygonsVertexAttributeNoDataColor,
  setModelPolyhedraPolyhedronAttribute,
  setModelPolyhedraVertexAttribute,
  setModelPolyhedraVertexAttributeNoDataColor,
};
