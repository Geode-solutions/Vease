import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
} from "@tests/utils/viewer_interaction.js";

async function setFeatureItem(window, menuTestId, item) {
  const container = window.getByTestId(menuTestId);
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
}

async function setFeatureColorMap(window, menuTestId, colorMap) {
  const container = window.getByTestId(menuTestId);
  await container.getByTestId("colorMapPicker").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .getByPlaceholder("Search presets...")
    .filter({ visible: true })
    .first()
    .fill(colorMap);
  await window.waitForTimeout(afterActionWait);

  // Wait for the loading spinner to disappear
  await window.locator(".v-progress-circular").first().waitFor({ state: "hidden" });
  await window.waitForTimeout(afterActionWait);

  // Expand all visible list groups to reveal search results
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

export { applyAttribute, setFeatureAttribute, setFeatureItem, setFeatureColorMap };
