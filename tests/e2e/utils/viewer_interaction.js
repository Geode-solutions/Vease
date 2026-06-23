// Constants
const beforeAllTimeout = 30_000;
const afterActionWait = 1500;
const MAX_PERCENTAGE = 100;
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

async function ensureMenuOpen(window, menuTestId) {
  console.log({ menuTestId });
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

async function pointsVisibility(window, viewerObjectType, visibility) {
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
}

async function applyAttribute(
  window,
  menuTestId,
  { attributeType, attributeName, colorMap = undefined, min = undefined, max = undefined } = {},
) {
  await ensureMenuOpen(window, menuTestId);

  await window.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .getByText(attributeType)
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  await window.getByTestId("attributeSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  const option = window
    .locator(".v-overlay-container")
    .getByText(attributeName, { exact: true })
    .filter({ visible: true })
    .first();

  await option.click();
  await window.waitForTimeout(afterActionWait);

  if (colorMap) {
    await window.getByTestId("colorMapPicker").first().click();
    await window.waitForTimeout(afterActionWait);

    await window.getByPlaceholder("Search presets...").fill(colorMap);
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
    const input = window.getByTestId("attributeMinInput").first().locator("input");
    await input.fill(min.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  if (max !== undefined) {
    const input = window.getByTestId("attributeMaxInput").first().locator("input");
    await input.fill(max.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  await window.waitForTimeout(afterActionWait);
}

async function vertexAttribute(window, menuTestId, attributeName = "points", options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Vertex attribute",
    attributeName,
    ...options,
  });
}

async function edgeAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Edge attribute",
    attributeName,
    ...options,
  });
}

async function cellAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Cell attribute",
    attributeName,
    ...options,
  });
}

async function polygonAttribute(window, menuTestId, attributeName, options = {}) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Polygon attribute",
    attributeName,
    ...options,
  });
}

async function polyhedraAttribute(window, menuTestId, attributeName, options = {}) {
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
    .first()
    .locator(".tree-item-label")
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
  const modelComponentRow = await getTreeRowByText(
    window,
    "modelComponentsObjectTree",
    hasText
  );
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
  await rgbaSlider.click({ position: { x: rgbaBox.width * SLIDER_BLUE, y: rgbaBox.height / 2 } });
  await window.waitForTimeout(afterActionWait);
}

async function changeColor(window, menuTestId, container = window) {
  await changeColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerCanvas(window, container);
}

async function changeColorWithSlider(window, menuTestId, container = window) {
  await changeColoringStyle(window, menuTestId, "Constant", container);
  await clickColorPickerSlider(window, container);
  await clickColorPickerCanvas(window, container);
}

async function changeComponentColorToBlue(window, menuTestId) {
  const container = window.locator(".options-section", { hasText: "Component Options" });
  await changeColor(window, menuTestId, container);
  await clickColorPickerSlider(window, container);
}

async function changeOpacity(window, menuTestId, percent) {
  await ensureMenuOpen(window, menuTestId);
  const alphaSlider = window
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
    .locator(".mdi-eye-off-outline")
    .first()
    .click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function openObjectTreeContextMenu(window, objectName, treeTestId = "mainObjectTree") {
  await getTreeRowByText(window, treeTestId, objectName).click({ button: "right" });
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

export {
  hybridViewerCanvas,
  afterActionWait,
  applyAttribute,
  beforeAllTimeout,
  cellAttribute,
  changeColor,
  changeColorWithSlider,
  changeComponentColorToBlue,
  changeOpacity,
  dragContextMenu,
  dragElement,
  edgeAttribute,
  expandComponentsType,
  focusObjectInTree,
  hideObjectInTree,
  openObjectTreeContextMenu,
  highlightData,
  hoverModelComponentRow,
  pointsVisibility,
  polygonAttribute,
  polyhedraAttribute,
  vertexAttribute,
  viewerContextMenu,
  hoverViewerCenter,
  showObjectInTree,
  changeColoringStyle,
  getTreeRowByText,
};

export { loadData } from "./load.js";
export { navigateToApp } from "./navigate.js";
