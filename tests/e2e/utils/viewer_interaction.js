/* eslint-disable max-lines */

// Constants
const beforeAllTimeout = 60_000;
const afterActionWait = 2000;
const MAX_PERCENTAGE = 100;
const WAIT_FOR_OPTIONS_TIMEOUT = 500;
const SLIDER_BLUE = 0.7;

function hybridViewerCanvas(window) {
  return window.getByTestId("hybridViewer").locator("canvas");
}

async function viewerContextMenu(window, x, y) {
  await window.getByTestId("hybridViewer").locator("canvas").click({
    button: "right",
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
}

async function findOverlappingObjectsPicker(window) {
  let found = false;
  const points = [
    { x: 440, y: 530 },
    { x: 600, y: 400 },
    { x: 600, y: 500 },
    { x: 600, y: 300 },
    { x: 500, y: 400 },
    { x: 700, y: 400 },
    { x: 550, y: 450 },
    { x: 650, y: 350 },
    { x: 650, y: 450 },
    { x: 550, y: 350 },
    { x: 400, y: 400 },
    { x: 800, y: 400 },
    { x: 450, y: 550 },
    { x: 500, y: 500 },
  ];

  for (const { x, y } of points) {
    // oxlint-disable-next-line no-await-in-loop
    await window.getByTestId("hybridViewer").locator("canvas").click({
      button: "right",
      position: { x, y },
      delay: 100,
    });
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(afterActionWait);

    // oxlint-disable-next-line no-await-in-loop
    const items = await window.locator(".intermediate-picker-item").count();
    if (items >= 2) {
      found = true;
      break;
    }
    // oxlint-disable-next-line no-await-in-loop
    await window.keyboard.press("Escape");
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(WAIT_FOR_OPTIONS_TIMEOUT);
  }

  if (!found) {
    throw new Error(
      "Could not find overlapping objects picker anywhere! The test data might not be loaded or the picker is broken.",
    );
  }
}

async function ensureMenuOpen(window, menuTestId) {
  const menuContainer = window.getByTestId(menuTestId);
  const menuButton = menuContainer.locator("button.menu-btn");
  if (!(await menuButton.evaluate((node) => node.classList.contains("v-btn--active")))) {
    // Programmatic click bypasses any overlapping panels or hit-testing issues
    await menuButton.evaluate((node) => node.click());
    await window.waitForTimeout(afterActionWait);
  }
}

async function ensureFeatureVisible(window, menuTestId) {
  const switchTestId = menuTestId.replace("Menu", "VisibilitySwitch");
  const visibilitySwitch = await window.getByTestId(switchTestId).getByRole("checkbox");
  if (!(await visibilitySwitch.isChecked())) {
    await visibilitySwitch.check({ force: true });
    // Wait for conditionally rendered options to appear
    await window.waitForTimeout(WAIT_FOR_OPTIONS_TIMEOUT);
  }
}

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

  const option = window
    .locator(".v-overlay-container")
    .getByText(attributeName, { exact: true })
    .filter({ visible: true })
    .first();

  await option.click();

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

async function highlightData(window, category) {
  await expandComponentsType(window, "mainObjectTree", category);
  const mainObjectTree = window.getByTestId("mainObjectTree");
  const testItem = mainObjectTree.getByText("test").first();
  await testItem.hover();
  await window.waitForTimeout(afterActionWait);
}

function getTreeRowByText(window, treeTestId, text) {
  return window
    .getByTestId(treeTestId)
    .locator(".tree-row-wrapper")
    .filter({ hasText: text })
    .first();
}

async function expandComponentsType(window, treeId, categoryName) {
  const rightChevron = getTreeRowByText(window, treeId, categoryName)
    .locator(".mdi-menu-right")
    .first();
  if ((await rightChevron.count()) > 0) {
    await rightChevron.dispatchEvent("click");
    await window.waitForTimeout(afterActionWait);
  }
}

async function hoverModelComponentRow(window, hasText) {
  await window.mouse.move(0, 0);
  await window.waitForTimeout(afterActionWait);
  const modelComponentRow = await getTreeRowByText(window, "modelComponentsObjectTree", hasText);
  console.log({ modelComponentRow });
  await modelComponentRow.locator(".tree-item-label").hover();
  await window.waitForTimeout(afterActionWait);
}

async function changeColoringStyle(window, menuTestId, coloringStyle, container = window) {
  await ensureMenuOpen(window, menuTestId);
  await container.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);
  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: coloringStyle, visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
}

async function clickColorPickerCanvas(window, container = window) {
  await container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function clickColorPickerSlider(window, container = window) {
  const rgbaSlider = container.getByTestId("colorPicker").locator(".v-slider").first();
  const rgbaBox = await rgbaSlider.boundingBox();
  await rgbaSlider.click({
    position: { x: rgbaBox.width * SLIDER_BLUE, y: rgbaBox.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

async function dragElement(window, locator, { targetX, targetY, deltaX = 0, deltaY = 0 } = {}) {
  const { x, y, width, height } = await locator.boundingBox();
  const startX = x + width / 2;
  const startY = y + height / 2;
  await window.mouse.move(startX, startY);
  await window.mouse.down();
  await window.mouse.move(targetX ?? startX + deltaX, targetY ?? startY + deltaY, { steps: 20 });
  await window.mouse.up();
  await window.waitForTimeout(afterActionWait);
}

async function dragContextMenu(window, { targetX, targetY } = {}) {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await dragElement(window, centerButton, { targetX, targetY });
}

async function hideObjectInTree(window, objectName, treeTestId = "mainObjectTree") {
  const row = getTreeRowByText(window, treeTestId, objectName);
  await row.waitFor({ state: "attached" });
  const btn = row.locator("button:has(.mdi-eye)").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await window.waitForTimeout(afterActionWait);
  }
}

async function focusObjectInTree(window, folderName, objectName) {
  await expandComponentsType(window, "mainObjectTree", folderName);
  await getTreeRowByText(window, "mainObjectTree", objectName)
    .locator("button:has(.mdi-target)")
    .click();
  await window.waitForTimeout(afterActionWait);
}

async function showObjectInTree(window, objectName, treeTestId = "mainObjectTree") {
  const row = getTreeRowByText(window, treeTestId, objectName);
  await row.waitFor({ state: "attached" });
  const btn = row.locator("button:has(.mdi-eye-off-outline, .mdi-eye-minus-outline)").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await window.waitForTimeout(afterActionWait);
  }
}

async function openObjectTreeContextMenu(window, objectName, treeTestId = "mainObjectTree") {
  await getTreeRowByText(window, treeTestId, objectName).click({
    button: "right",
  });
  await window.waitForTimeout(afterActionWait);
}

function setPolygonsTextures(window, viewerObjectType) {
  return setFeatureTextures(window, viewerObjectType, "Polygons");
}
async function setFeatureTextures(window, viewerObjectType, feature) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const container = window.getByTestId(menuTestId);
  const selector = container.getByTestId("coloringStyleSelector").first();
  await selector.click();
  await window.waitForTimeout(afterActionWait);

  const listItem = window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: "Textures", visible: true })
    .first();
  await listItem.click();
  await window.waitForTimeout(afterActionWait);
}

async function hoverViewerCenter(window) {
  const canvas = hybridViewerCanvas(window);
  const box = await canvas.boundingBox();
  await canvas.hover({
    position: { x: box.width / 2, y: box.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

async function stabilizeHoverTooltip(window) {
  await window.addStyleTag({
    content: ".tooltip-value-dim { visibility: hidden !important; }",
  });
}

function setFeatureVisibility(window, viewerObjectType, feature, visibility) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  const switchTestId = `${viewerObjectType}${feature}VisibilitySwitch`;
  return setVisibilityGeneric(window, menuTestId, switchTestId, visibility);
}

async function setVisibilityGeneric(window, menuTestId, switchTestId, visibility) {
  await ensureMenuOpen(window, menuTestId);
  const checkbox = window.getByTestId(switchTestId).getByRole("checkbox");
  if (visibility) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
  await window.waitForTimeout(afterActionWait);
}

async function setFeatureSizeOrWidth(window, viewerObjectType, feature, value) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  let sliderTestId = `${viewerObjectType}${feature}SizeSlider`;
  if (feature === "Edges") {
    sliderTestId = `${viewerObjectType}${feature}WidthSlider`;
  }
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const slider = await window.getByTestId(sliderTestId);
  await slider
    .locator("input")
    .first()
    .evaluate((node, val) => {
      node.value = val;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, value.toString());
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
    position: {
      x: (box.width * percent) / MAX_PERCENTAGE,
      y: box.height / 2,
    },
  });
  await window.waitForTimeout(afterActionWait);
}

function setFeatureOpacity(window, viewerObjectType, feature, percent) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  return setOpacity(window, menuTestId, percent);
}

async function setColor(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerCanvas(window, container);
}

function setFeatureColor(window, viewerObjectType, feature, container = window) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  return setColor(window, menuTestId, container);
}

async function setColorWithSlider(window, menuTestId, container = window) {
  await setColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerSlider(window, container);
  await clickColorPickerCanvas(window, container);
}

function setFeatureColorWithSlider(window, viewerObjectType, feature, container = window) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  return setColorWithSlider(window, menuTestId, container);
}

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

function setFeatureColoringStyle(
  window,
  viewerObjectType,
  feature,
  coloringStyle,
  container = window,
) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  return setColoringStyle(window, menuTestId, coloringStyle, container);
}

// Specific feature functions
function setPointsVisibility(window, viewerObjectType, visibility) {
  if (viewerObjectType === "model") {
    return setVisibilityGeneric(
      window,
      "modelPointsMenu",
      "modelPointsVisibilitySwitch",
      visibility,
    );
  }
  return setFeatureVisibility(window, viewerObjectType, "Points", visibility);
}
function setEdgesVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Edges", visibility);
}
function setPolygonsVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Polygons", visibility);
}
function setPolyhedraVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Polyhedra", visibility);
}
function setCellsVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Cells", visibility);
}

function setPointsSize(window, viewerObjectType, value) {
  return setFeatureSizeOrWidth(window, viewerObjectType, "Points", value);
}
function setEdgesWidth(window, viewerObjectType, value) {
  return setFeatureSizeOrWidth(window, viewerObjectType, "Edges", value);
}

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
function setModelOpacity(window, percent) {
  return setOpacity(window, "modelStyleMenu", percent);
}

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
function setModelColor(window) {
  return setColor(window, "modelStyleMenu");
}

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
function setModelColorWithSlider(window) {
  return setColorWithSlider(window, "modelStyleMenu");
}

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
function setModelColoringStyle(window, style) {
  return setColoringStyle(window, "modelStyleMenu", style);
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
  return applyAttribute(window, menuTestId, {
    attributeType,
    attributeName,
    ...options,
  });
}

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
  hybridViewerCanvas,
  afterActionWait,
  applyAttribute,
  beforeAllTimeout,
  dragContextMenu,
  dragElement,
  expandComponentsType,
  findOverlappingObjectsPicker,
  focusObjectInTree,
  getTreeRowByText,
  hideObjectInTree,
  highlightData,
  hoverModelComponentRow,
  hoverViewerCenter,
  openObjectTreeContextMenu,
  setCellsCellAttribute,
  setCellsColor,
  setCellsColorWithSlider,
  setCellsColoringStyle,
  setCellsOpacity,
  setCellsVertexAttribute,
  setCellsVisibility,
  setColor,
  setColorWithSlider,
  setColoringStyle,
  setEdgesColor,
  setEdgesColorWithSlider,
  setEdgesColoringStyle,
  setEdgesEdgeAttribute,
  setEdgesOpacity,
  setEdgesVertexAttribute,
  setEdgesVisibility,
  setEdgesWidth,
  setModelColor,
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelOpacity,
  setOpacity,
  setPointsColor,
  setPointsColorWithSlider,
  setPointsColoringStyle,
  setPointsOpacity,
  setPointsSize,
  setPointsVertexAttribute,
  setPointsVisibility,
  setPolygonsColor,
  setPolygonsColorWithSlider,
  setPolygonsColoringStyle,
  setPolygonsOpacity,
  setPolygonsPolygonAttribute,
  setPolygonsTextures,
  setPolygonsVertexAttribute,
  setPolygonsVisibility,
  setPolyhedraColor,
  setPolyhedraColorWithSlider,
  setPolyhedraColoringStyle,
  setPolyhedraOpacity,
  setPolyhedraPolyhedronAttribute,
  setPolyhedraVertexAttribute,
  setPolyhedraVisibility,
  showObjectInTree,
  changeColoringStyle,
  stabilizeHoverTooltip,
  viewerContextMenu,
};

export { loadData } from "./load.js";
export { navigateToApp } from "./navigate.js";
