import {
  MAX_PERCENTAGE,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/coloring_style/color_picker_helpers.js";
import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
} from "@tests/utils/viewer_interaction.js";

async function setColoringStyle(window, menuTestId, coloringStyle, container = window) {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const selector = container.getByTestId("coloringStyleSelector").first();
  await selector.waitFor({ state: "visible", timeout: 15_000 });
  await selector.click();
  await window.waitForTimeout(afterActionWait);

  const listItem = window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: coloringStyle, visible: true })
    .first();
  await listItem.waitFor({ state: "visible", timeout: 15_000 });
  await listItem.click();
  await window.waitForTimeout(afterActionWait);
}

async function setOpacity(window, menuTestId, percent) {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const menu = window.getByTestId(menuTestId);
  const alphaSlider = menu
    .getByTestId("colorPicker")
    .locator(".v-color-picker-preview__alpha, .v-color-picker__alpha")
    .first();
  const box = await alphaSlider.boundingBox();
  await alphaSlider.click({
    force: true,
    position: { x: (box.width * percent) / MAX_PERCENTAGE, y: box.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

async function setColor(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerCanvas(window, container);
}

async function setColorWithSlider(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerSlider(window, container);
  await clickColorPickerCanvas(window, container);
}

function setFeatureOpacity(window, viewerObjectType, feature, percent) {
  return setOpacity(window, `${viewerObjectType}${feature}Menu`, percent);
}

function setFeatureColor(window, viewerObjectType, feature, container = window) {
  return setColor(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureColorWithSlider(window, viewerObjectType, feature, container = window) {
  return setColorWithSlider(window, `${viewerObjectType}${feature}Menu`, container);
}

function setFeatureColoringStyle(
  window,
  viewerObjectType,
  feature,
  coloringStyle,
  container = window,
) {
  return setColoringStyle(window, `${viewerObjectType}${feature}Menu`, coloringStyle, container);
}

// Opacity
function setPointsOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Points", percent);
}
function setEdgesOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Edges", percent);
}
function setPolygonsOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Polygons", percent);
}
function setPolyhedraOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Polyhedra", percent);
}
function setCellsOpacity(window, viewerObjectType, percent) {
  return setFeatureOpacity(window, viewerObjectType, "Cells", percent);
}

// Constant color
function setPointsColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Points");
}
function setEdgesColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Edges");
}
function setPolygonsColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Polygons");
}
function setPolyhedraColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Polyhedra");
}
function setCellsColor(window, viewerObjectType) {
  return setFeatureColor(window, viewerObjectType, "Cells");
}

// Color with slider
function setPointsColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Points");
}
function setEdgesColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Edges");
}
function setPolygonsColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Polygons");
}
function setPolyhedraColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Polyhedra");
}
function setCellsColorWithSlider(window, viewerObjectType) {
  return setFeatureColorWithSlider(window, viewerObjectType, "Cells");
}

// Coloring style
function setPointsColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Points", style);
}
function setEdgesColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Edges", style);
}
function setPolygonsColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Polygons", style);
}
function setPolyhedraColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Polyhedra", style);
}
function setCellsColoringStyle(window, viewerObjectType, style) {
  return setFeatureColoringStyle(window, viewerObjectType, "Cells", style);
}

export {
  setCellsColor,
  setCellsColorWithSlider,
  setCellsColoringStyle,
  setCellsOpacity,
  setColor,
  setColorWithSlider,
  setColoringStyle,
  setEdgesColor,
  setEdgesColorWithSlider,
  setEdgesColoringStyle,
  setEdgesOpacity,
  setOpacity,
  setPointsColor,
  setPointsColorWithSlider,
  setPointsColoringStyle,
  setPointsOpacity,
  setPolygonsColor,
  setPolygonsColorWithSlider,
  setPolygonsColoringStyle,
  setPolygonsOpacity,
  setPolyhedraColor,
  setPolyhedraColorWithSlider,
  setPolyhedraColoringStyle,
  setPolyhedraOpacity,
};
