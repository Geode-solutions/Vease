import { applyAttribute, setFeatureNoDataColor } from "@tests/utils/data/helpers/attribute";
import {
  cellAttributeType,
  edgeAttributeType,
  polygonAttributeType,
  polyhedronAttributeType,
  vertexAttributeType,
} from "@tests/utils/constants";
import type { Page } from "@playwright/test";

interface AttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

async function setModelPointsVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelPointsVertexAttributeNoDataColor(window: Page): Promise<void> {
  await setFeatureNoDataColor(window, "modelStyleMenu");
}

async function setModelEdgesVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelEdgesVertexAttributeNoDataColor(window: Page): Promise<void> {
  await setFeatureNoDataColor(window, "modelStyleMenu");
}

async function setModelPolygonsVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelPolygonsVertexAttributeNoDataColor(window: Page): Promise<void> {
  await setFeatureNoDataColor(window, "modelStyleMenu");
}

async function setModelPolyhedraVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelPolyhedraVertexAttributeNoDataColor(window: Page): Promise<void> {
  await setFeatureNoDataColor(window, "modelStyleMenu");
}

async function setModelCellsVertexAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelEdgesEdgeAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: edgeAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelPolygonsPolygonAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: polygonAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelPolyhedraPolyhedronAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
    attributeType: polyhedronAttributeType,
    attributeName,
    ...options,
  });
}

async function setModelCellsCellAttribute(
  window: Page,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await applyAttribute(window, "modelStyleMenu", {
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
