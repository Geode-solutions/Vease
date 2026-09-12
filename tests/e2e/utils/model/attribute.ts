import { applyAttribute, setFeatureNoDataColor } from "@tests/utils/helpers/attribute";
import {
  cellAttributeType,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  vertexAttributeType,
} from "@tests/utils/constants";

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
