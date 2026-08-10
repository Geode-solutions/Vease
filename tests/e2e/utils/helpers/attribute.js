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
  await container.getByTestId("itemSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  const itemText = `Item ${item + 1}`;
  await window
    .locator(".v-overlay-container")
    .getByText(itemText, { exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
}

async function setFeatureColorMap(window, menuTestId, colorMap) {
  const container = getMenuContainer(window, menuTestId);
  await container.getByTestId("colorMapPicker").first().click();
  await window.waitForTimeout(afterActionWait);
  const colorMapListFilter = window.getByTestId("colorMapListFilter");
  await colorMapListFilter.filter({ visible: true }).first().locator("input").fill(colorMap);
  const colorMapListLoading = window.getByTestId("colorMapListLoading");
  await colorMapListLoading.waitFor({ state: "detached" });

  await window.waitForTimeout(afterActionWait);

  const groups = window
    .getByTestId("colorMapList")
    .locator(".text-white.font-weight-bold")
    .filter({ visible: true });
  const allGroups = await groups.all();
  // oxlint-disable no-await-in-loop
  for (const group of allGroups) {
    await group.click();
    await window.waitForTimeout(afterActionWait);
  }
  // oxlint-enable no-await-in-loop

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
  let testIdStr = "modelStyleMenu";
  if (typeof menuTestId === "string") {
    testIdStr = menuTestId;
  }

  await ensureMenuOpen(window, testIdStr);
  await ensureFeatureVisible(window, testIdStr);

  const container = getMenuContainer(window, menuTestId);
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

export { applyAttribute, setFeatureAttribute, setFeatureItem, setFeatureColorMap };
