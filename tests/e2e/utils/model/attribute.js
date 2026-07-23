import {
  cellAttributeType,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  vertexAttributeType,
} from "@tests/utils/constants.js";
import { applyAttribute } from "@tests/utils/helpers/attribute.js";

function setModelPointsVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelEdgesVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPolygonsVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelPolyhedraVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

function setModelCellsVertexAttribute(window, attributeName = "points", options = {}) {
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
  setModelPointsVertexAttribute,
  setModelPolygonsPolygonAttribute,
  setModelPolygonsVertexAttribute,
  setModelPolyhedraPolyhedronAttribute,
  setModelPolyhedraVertexAttribute,
};
