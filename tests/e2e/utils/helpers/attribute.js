import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
} from "@tests/utils/viewer_interaction.js";

function getMenuContainer(window, menuTestId) {
  if (typeof menuTestId === "string") {
    return window.getByTestId(menuTestId);
  }
  return menuTestId;
}

async function setFeatureItem(window, menuTestId, item) {
  const container = getMenuContainer(window, menuTestId);
  const itemSelector = container.getByTestId("itemSelector").first();
  if (await itemSelector.isVisible()) {
    await itemSelector.click();
    await window.waitForTimeout(afterActionWait);

    const itemText = `Item ${item + 1}`;
    await window
      .locator(".v-overlay-container")
      .locator(".v-list-item")
      .filter({ hasText: itemText, visible: true })
      .first()
      .click();
    await window.waitForTimeout(afterActionWait);
    await moveMouseOutOfTheWay(window);
  }
}

async function setFeatureColorMap(window, menuTestId, colorMap) {
  const container = getMenuContainer(window, menuTestId);
  const colorMapPicker = container.getByTestId("colorMapPicker").first();
  await colorMapPicker.waitFor({ state: "visible" });
  await colorMapPicker.click();
  await window.waitForTimeout(afterActionWait);
  const colorMapListFilter = window.getByTestId("colorMapListFilter");
  await colorMapListFilter.filter({ visible: true }).first().locator("input").fill(colorMap);
  const colorMapListLoading = window.getByTestId("colorMapListLoading");
  await colorMapListLoading.waitFor({ state: "detached" });
  await window.waitForTimeout(afterActionWait);

  await window
    .getByTestId("colorMapList")
    .getByText(colorMap, { exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
}

async function applyAttribute(
  window,
  menuTestId,
  {
    attributeType,
    attributeName,
    item = undefined,
    colorMap = undefined,
    min = undefined,
    max = undefined,
  } = {},
) {
  if (typeof menuTestId === "string") {
    await ensureMenuOpen(window, menuTestId);
    await ensureFeatureVisible(window, menuTestId);
  }

  const container = getMenuContainer(window, menuTestId);
  await container.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: attributeType, visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  const attributeSelector = container.getByTestId("attributeSelector").first();
  await attributeSelector.waitFor({ state: "visible" });
  await attributeSelector.click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: attributeName, visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  if (item !== undefined) {
    await setFeatureItem(window, menuTestId, item);
  }

  if (colorMap) {
    await setFeatureColorMap(window, menuTestId, colorMap);
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
  await moveMouseOutOfTheWay(window);
}

function setFeatureAttribute(
  window,
  viewerObjectType,
  feature,
  attributeType,
  attributeName,
  options = {},
) {
  let menuTestId = `${viewerObjectType}${feature}Menu`;
  if (viewerObjectType === "model") {
    menuTestId = "modelStyleMenu";
  }
  return applyAttribute(window, menuTestId, { attributeType, attributeName, ...options });
}

async function setQuickColorMap(window, colorMap) {
  const colorMapListFilter = window
    .getByTestId("colorMapListFilter")
    .filter({ visible: true })
    .first();
  await colorMapListFilter.locator("input").fill(colorMap);
  const colorMapListLoading = window.getByTestId("colorMapListLoading");
  await colorMapListLoading.waitFor({ state: "detached" });
  await window.waitForTimeout(afterActionWait);

  await window
    .getByTestId("colorMapList")
    .getByText(colorMap, { exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
}

export {
  applyAttribute,
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
  setQuickColorMap,
};
