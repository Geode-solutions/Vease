import { applyAttribute } from "@tests/utils/coloring_style/mesh/attribute.js";

// All model attribute functions call applyAttribute with "modelStyleMenu"
function setModelPointsVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

function setModelEdgesVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

function setModelPolygonsVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

function setModelPolyhedraVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

function setModelCellsVertexAttribute(window, attributeName = "points", options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

function setModelEdgesEdgeAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Edge attribute",
    attributeName,
    ...options,
  });
}

function setModelPolygonsPolygonAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Polygon attribute",
    attributeName,
    ...options,
  });
}

function setModelPolyhedraPolyhedronAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Polyhedron attribute",
    attributeName,
    ...options,
  });
}

function setModelCellsCellAttribute(window, attributeName, options = {}) {
  return applyAttribute(window, "modelStyleMenu", {
    attributeType: "Cell attribute",
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
