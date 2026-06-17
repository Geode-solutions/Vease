/* eslint-disable max-lines */

// Constants
const beforeAllTimeout = 30_000;
const afterActionWait = 1500;
const MAX_PERCENTAGE = 100;
const WAIT_FOR_OPTIONS_TIMEOUT = 500;
const SLIDER_BLUE = 0.7;

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
  const menuButton = window.getByTestId(menuTestId);
  if (
    !(await menuButton
      .locator("button.menu-btn")
      .evaluate((node) => node.classList.contains("v-btn--active")))
  ) {
    await menuButton.click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function ensureMenuClosed(window, menuTestId) {
  const menuButton = window.getByTestId(menuTestId);
  if (
    await menuButton
      .locator("button.menu-btn")
      .evaluate((node) => node.classList.contains("v-btn--active"))
  ) {
    await menuButton.click();
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

async function setPointsVisibility(window, viewerObjectType, visibility) {
  const menuTestId = viewerObjectType === "model" ? "modelPointsMenu" : "meshPointsMenu";
  const switchTestId =
    viewerObjectType === "model" ? "modelPointsVisibilitySwitch" : "meshPointsVisibilitySwitch";

  await ensureMenuOpen(window, menuTestId);
  const checkbox = window.getByTestId(switchTestId).getByRole("checkbox");
  if (visibility) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
  await window.waitForTimeout(afterActionWait);
  await ensureMenuClosed(window, menuTestId);
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

    await window.locator(".v-overlay-container").getByPlaceholder("Search presets...").fill(colorMap);
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
  await ensureMenuClosed(window, menuTestId);
}

async function setVertexAttribute(window, menuTestId, attributeName = "points", options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

async function setEdgeAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Edge attribute",
    attributeName,
    ...options,
  });
}

async function setCellAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Cell attribute",
    attributeName,
    ...options,
  });
}

async function setPolygonAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Polygon attribute",
    attributeName,
    ...options,
  });
}

async function setPolyhedraAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Polyhedron attribute",
    attributeName,
    ...options,
  });
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
  await getTreeRowByText(window, "modelComponentsObjectTree", hasText).hover();
  await window.waitForTimeout(afterActionWait);
}

async function changeColoringStyle(window, menuTestId, coloringStyle, container = window) {
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

async function clickColorPickerCanvas(window, container = window) {
  await container.getByTestId("colorPicker").locator(".v-color-picker-canvas").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function clickColorPickerSlider(window, container = window) {
  const rgbaSlider = container.getByTestId("colorPicker").locator(".v-slider").first();
  const rgbaBox = await rgbaSlider.boundingBox();
  await rgbaSlider.click({ position: { x: rgbaBox.width * SLIDER_BLUE, y: rgbaBox.height / 2 } });
  await window.waitForTimeout(afterActionWait);
}

async function changeColor(window, menuTestId, container = window) {
  await changeColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerCanvas(window, container);
  await ensureMenuClosed(window, menuTestId);
}

async function changeColorWithSlider(window, menuTestId, container = window) {
  await changeColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerSlider(window, container);
  await clickColorPickerCanvas(window, container);
  await ensureMenuClosed(window, menuTestId);
}

async function changeComponentColorToBlue(window, menuTestId) {
  const container = window.locator(".options-section", { hasText: "Component Options" });
  await changeColor(window, menuTestId, container);
  await clickColorPickerSlider(window, container);
  await ensureMenuClosed(window, menuTestId);
}

async function changeOpacity(window, menuTestId, percent) {
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
  await ensureMenuClosed(window, menuTestId);
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
  await getTreeRowByText(window, treeTestId, objectName)
    .locator(".mdi-eye")
    .first()
    .click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function focusObjectInTree(window, folderName, objectName) {
  await expandComponentsType(window, "mainObjectTree", folderName);
  await getTreeRowByText(window, "mainObjectTree", objectName)
    .locator("button:has(.mdi-target)")
    .click();
  await window.waitForTimeout(afterActionWait);
}

async function showObjectInTree(window, objectName, treeTestId = "mainObjectTree") {
  await getTreeRowByText(window, treeTestId, objectName)
    .locator("button:has(.mdi-eye-off-outline, .mdi-eye-minus-outline)")
    .first()
    .click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function openObjectTreeContextMenu(window, objectName, treeTestId = "mainObjectTree") {
  await getTreeRowByText(window, treeTestId, objectName).click({ button: "right" });
  await window.waitForTimeout(afterActionWait);
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
async function setFeatureVisibility(window, viewerObjectType, feature, visibility) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  const switchTestId = `${viewerObjectType}${feature}VisibilitySwitch`;
  await ensureMenuOpen(window, menuTestId);
  const checkbox = window.getByTestId(switchTestId).getByRole("checkbox");
  if (visibility) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
  await window.waitForTimeout(afterActionWait);
  await ensureMenuClosed(window, menuTestId);
}

function setPointsSize(window, viewerObjectType, value) {
  return setFeatureSizeOrWidth(window, viewerObjectType, "Points", value);
}
function setEdgesWidth(window, viewerObjectType, value) {
  return setFeatureSizeOrWidth(window, viewerObjectType, "Edges", value);
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
  await ensureMenuClosed(window, menuTestId);
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
  await ensureMenuClosed(window, menuTestId);
}

async function hoverViewerCenter(window) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  const box = await canvas.boundingBox();
  await canvas.hover({
    position: { x: box.width / 2, y: box.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

export {
  setEdgesVisibility,
  setPolygonsVisibility,
  setPolyhedraVisibility,
  setCellsVisibility,
  setPointsSize,
  setEdgesWidth,
  setPolygonsTextures,
  afterActionWait,
  applyAttribute,
  beforeAllTimeout,
  setCellAttribute,
  changeColor,
  changeColoringStyle,
  changeColorWithSlider,
  changeComponentColorToBlue,
  changeOpacity,
  dragContextMenu,
  dragElement,
  setEdgeAttribute,
  expandComponentsType,
  focusObjectInTree,
  findOverlappingObjectsPicker,
  hideObjectInTree,
  openObjectTreeContextMenu,
  highlightData,
  hoverModelComponentRow,
  setPointsVisibility,
  setPolygonAttribute,
  setPolyhedraAttribute,
  setVertexAttribute,
  showObjectInTree,
  viewerContextMenu,
  hoverViewerCenter,
  getTreeRowByText,
};
export { loadData } from "./load.js";
export { navigateToApp } from "./navigate.js";
