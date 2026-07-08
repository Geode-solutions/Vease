import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
} from "@tests/utils/viewer_interaction.js";

async function applyAttribute(
  window,
  menuTestId,
  { attributeType, attributeName, colorMap = undefined, min = undefined, max = undefined } = {},
) {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const container = window.getByTestId(menuTestId);
  await container.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .getByText(attributeType)
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  await container.getByTestId("attributeSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .getByText(attributeName, { exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  if (colorMap) {
    await container.getByTestId("colorMapPicker").first().click();
    await window.waitForTimeout(afterActionWait);

    await window
      .locator(".v-overlay-container")
      .getByPlaceholder("Search presets...")
      .fill(colorMap);
    await window.waitForTimeout(afterActionWait);

    await window
      .getByTestId("colorMapList")
      .getByText(colorMap, { exact: true })
      .filter({ visible: true })
      .first()
      .click();
    await window.waitForTimeout(afterActionWait);
  }

  if (min !== undefined) {
    const input = container.getByTestId("attributeMinInput").first().locator("input");
    await input.fill(min.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  if (max !== undefined) {
    const input = container.getByTestId("attributeMaxInput").first().locator("input");
    await input.fill(max.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  await window.waitForTimeout(afterActionWait);
}

function setFeatureAttribute(
  window,
  viewerObjectType,
  feature,
  attributeType,
  attributeName,
  options = {},
) {
  const menuTestId =
    viewerObjectType === "model" ? "modelStyleMenu" : `${viewerObjectType}${feature}Menu`;
  return applyAttribute(window, menuTestId, { attributeType, attributeName, ...options });
}

// Vertex attributes
function setPointsVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Points",
    "Vertex attribute",
    attributeName,
    options,
  );
}
function setEdgesVertexAttribute(window, viewerObjectType, attributeName = "points", options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Edges",
    "Vertex attribute",
    attributeName,
    options,
  );
}
function setPolygonsVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polygons",
    "Vertex attribute",
    attributeName,
    options,
  );
}
function setPolyhedraVertexAttribute(
  window,
  viewerObjectType,
  attributeName = "points",
  options = {},
) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polyhedra",
    "Vertex attribute",
    attributeName,
    options,
  );
}
function setCellsVertexAttribute(window, viewerObjectType, attributeName = "points", options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Cells",
    "Vertex attribute",
    attributeName,
    options,
  );
}

// Element-type attributes
function setEdgesEdgeAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Edges",
    "Edge attribute",
    attributeName,
    options,
  );
}
function setPolygonsPolygonAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polygons",
    "Polygon attribute",
    attributeName,
    options,
  );
}
function setPolyhedraPolyhedronAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Polyhedra",
    "Polyhedron attribute",
    attributeName,
    options,
  );
}
function setCellsCellAttribute(window, viewerObjectType, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    viewerObjectType,
    "Cells",
    "Cell attribute",
    attributeName,
    options,
  );
}

export {
  applyAttribute,
  setCellsCellAttribute,
  setCellsVertexAttribute,
  setEdgesEdgeAttribute,
  setEdgesVertexAttribute,
  setPointsVertexAttribute,
  setPolygonsPolygonAttribute,
  setPolygonsVertexAttribute,
  setPolyhedraPolyhedronAttribute,
  setPolyhedraVertexAttribute,
};
