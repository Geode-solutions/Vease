import type { Locator, Page } from "@playwright/test";
import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/data/helpers/color_picker";
import {
  afterActionWait,
  ensureFeatureVisible,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
} from "@tests/utils/viewer_interaction";

async function resetMenuScroll(window: Page, scrollTop = 0): Promise<void> {
  await window.evaluate((top) => {
    const cardTexts = document.querySelectorAll(".v-card-text");
    for (const cardTextElement of cardTexts) {
      cardTextElement.scrollTop = top;
    }
  }, scrollTop);
}

function getMenuContainer(window: Page, menuTestId: string | Locator): Locator {
  if (typeof menuTestId === "string") {
    return window.getByTestId(menuTestId);
  }
  return menuTestId;
}

async function setFeatureItem(
  window: Page,
  menuTestId: string | Locator,
  item: number,
): Promise<void> {
  const container = getMenuContainer(window, menuTestId);
  const itemSelector = container.getByTestId("itemSelector").first();
  await itemSelector.waitFor({ state: "visible" });
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
  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
}

async function setFeatureColorMap(
  window: Page,
  menuTestId: string | Locator,
  colorMap: string,
): Promise<void> {
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

  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

interface ApplyAttributeOptions {
  attributeType: string;
  attributeName: string;
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

async function applyAttribute(
  window: Page,
  menuTestId: string | Locator,
  { attributeType, attributeName, item, colorMap, min, max }: ApplyAttributeOptions,
): Promise<void> {
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

  if (colorMap !== undefined && colorMap !== "") {
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
  await resetMenuScroll(window, 0);
  await window.waitForTimeout(afterActionWait);
  await moveMouseOutOfTheWay(window);
}

interface FeatureAttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

async function setFeatureAttribute(
  window: Page,
  viewerObjectType: string,
  feature: string,
  attributeType: string,
  attributeName: string,
  options: FeatureAttributeOptions = {},
): Promise<void> {
  let menuTestId = `${viewerObjectType}${feature}Menu`;
  if (viewerObjectType === "model") {
    menuTestId = "modelStyleMenu";
  }
  await applyAttribute(window, menuTestId, { attributeType, attributeName, ...options });
}

async function setQuickColorMap(window: Page, colorMap: string): Promise<void> {
  const colorMapListFilter = window
    .getByTestId("colorMapListFilter")
    .filter({ visible: true })
    .first();
  await colorMapListFilter.locator("input").waitFor({ state: "visible" });
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

async function setFeatureNoDataColor(window: Page, menuTestId: string | Locator): Promise<void> {
  if (typeof menuTestId === "string") {
    await ensureMenuOpen(window, menuTestId);
  }
  const container = getMenuContainer(window, menuTestId);
  const noDataColorBtn = container.getByTestId("noDataColorBtn").first();
  await noDataColorBtn.waitFor({ state: "visible" });
  await noDataColorBtn.click();
  await window.waitForTimeout(afterActionWait);
  await window
    .getByTestId("colorPicker")
    .filter({ visible: true })
    .first()
    .waitFor({ state: "visible" });
  await clickColorPickerSlider(window, SLIDER_PINK);
  await clickColorPickerCanvas(window);
  await noDataColorBtn.click();
  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

export {
  applyAttribute,
  resetMenuScroll,
  setFeatureAttribute,
  setFeatureColorMap,
  setFeatureItem,
  setFeatureNoDataColor,
  setQuickColorMap,
};
