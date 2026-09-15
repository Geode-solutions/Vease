<<<<<<<< HEAD:tests/e2e/utils/data/model/attribute.js
import {
  applyAttribute,
  setFeatureNoDataColor,
} from "vease/tests/e2e/utils/data/helpers/attribute.js";
========
import { applyAttribute, setFeatureNoDataColor } from "@tests/utils/helpers/attribute";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/model/attribute.ts
import {
  cellAttributeType,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  vertexAttributeType,
<<<<<<<< HEAD:tests/e2e/utils/data/model/attribute.js
} from "vease/tests/e2e/utils/constants.js";
========
} from "@tests/utils/constants";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/model/attribute.ts

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
