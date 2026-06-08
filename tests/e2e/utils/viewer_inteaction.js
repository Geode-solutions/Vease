import { loadData } from "./load.js";
import { navigateToApp } from "./navigate.js";

// Constants
const beforeAllTimeout = 30_000;
const afterActionWait = 1500;

async function viewerContextMenu(window, x, y) {
  await window.getByTestId("hybridViewer").locator("canvas").click({
    button: "right",
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
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

async function pointsVisibility(window, viewerObjectType, visibility) {
  const menuTestId =
    viewerObjectType === "model" ? "modelPointsMenu" : "meshPointsMenu";
  const switchTestId =
    viewerObjectType === "model"
      ? "modelPointsVisibilitySwitch"
      : "meshPointsVisibilitySwitch";

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
  {
    attributeType,
    attributeName,
    colorMap = undefined,
    min = undefined,
    max = undefined,
  } = {},
) {
  const menuButton = window.getByTestId(menuTestId);
  if (
    !(await menuButton
      .locator("button.menu-btn")
      .evaluate((node) => node.classList.contains("v-btn--active")))
  ) {
    await menuButton.click();
    await window.waitForTimeout(afterActionWait);
  }

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

  if ((await option.count()) > 0) {
    await option.click();
  } else {
    await window
      .locator(".v-overlay-container")
      .locator(".v-list-item")
      .filter({ visible: true })
      .first()
      .click();
  }
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
    const input = window
      .getByTestId("attributeMinInput")
      .first()
      .locator("input");
    await input.fill(min.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  if (max !== undefined) {
    const input = window
      .getByTestId("attributeMaxInput")
      .first()
      .locator("input");
    await input.fill(max.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  await window.waitForTimeout(afterActionWait);
}

async function vertexAttribute(
  window,
  menuTestId,
  attributeName = "points",
  options = {},
) {
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

async function polygonAttribute(
  window,
  menuTestId,
  attributeName,
  options = {},
) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Polygon attribute",
    attributeName,
    ...options,
  });
}

async function polyhedraAttribute(
  window,
  menuTestId,
  attributeName,
  options = {},
) {
  await applyAttribute(window, menuTestId, {
    attributeType: "Polyhedron attribute",
    attributeName,
    ...options,
  });
}

export {
  afterActionWait,
  applyAttribute,
  beforeAllTimeout,
  loadData,
  navigateToApp,
  pointsVisibility,
  viewerContextMenu,
  vertexAttribute,
  edgeAttribute,
  cellAttribute,
  polygonAttribute,
  polyhedraAttribute,
};
