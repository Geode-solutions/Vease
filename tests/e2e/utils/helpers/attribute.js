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

export { applyAttribute, setFeatureAttribute };
