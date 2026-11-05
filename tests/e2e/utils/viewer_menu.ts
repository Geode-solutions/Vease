// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import {
  COMPONENT_TYPE_TAB_SWITCHES,
  MODEL_TAB_SWITCHES,
  getActiveModelTabTestId,
  restoreModelTab,
  selectModelTab,
} from "./model_tabs";
import { halfSecondWait } from "./constants";
import { moveMouseOutOfTheWay } from "./app_interaction";
import { viewerContextMenu } from "./viewer_canvas";
import { waitForActionSettled } from "./wait_for_action_settled";

async function ensureMenuOpen(window: Page, menuTestId: string): Promise<void> {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  if (!(await centerButton.isVisible())) {
    const contextMenuX = 549;
    const contextMenuY = 360;
    await viewerContextMenu(window, contextMenuX, contextMenuY);
  }
  const menuContainer = window.getByTestId(menuTestId);
  const activeCircularMenuItemButton = menuContainer.getByTestId("activeCircularMenuItemButton");
  if (!(await activeCircularMenuItemButton.isVisible())) {
    const activeMenuButton = window.getByTestId("activeCircularMenuItemButton");
    if (await activeMenuButton.isVisible()) {
      await activeMenuButton.click();
      await waitForActionSettled(window);
    }
    const menuButton = menuContainer
      .getByTestId("circularMenuItemButton")
      .or(menuContainer.getByTestId("activeCircularMenuItemButton"))
      .first();
    await menuButton.click();
    await waitForActionSettled(window);
  }
}

async function ensureFeatureVisible(window: Page, menuTestId: string): Promise<void> {
  const switchTestId = menuTestId.replace("Menu", "VisibilitySwitch");
  // The model switch can sit in a hidden tab
  const visibilitySwitch = window
    .getByTestId(switchTestId)
    .getByRole("checkbox", { includeHidden: true });
  if (await visibilitySwitch.isChecked()) {
    return;
  }
  const activeTabTestId = await getActiveModelTabTestId(window);
  if (MODEL_TAB_SWITCHES.has(switchTestId)) {
    await selectModelTab(window, "model");
  }
  await visibilitySwitch.check({ force: true });
  // Wait for conditionally rendered options to appear
  await window.waitForTimeout(halfSecondWait);
  await restoreModelTab(window, activeTabTestId);
}

async function setVisibilityGeneric(
  window: Page,
  menuTestId: string,
  switchTestId: string,
  visibility: boolean,
): Promise<void> {
  await ensureMenuOpen(window, menuTestId);
  if (MODEL_TAB_SWITCHES.has(switchTestId)) {
    await selectModelTab(window, "model");
  } else if (COMPONENT_TYPE_TAB_SWITCHES.has(switchTestId)) {
    await selectModelTab(window, "type");
  }
  const checkbox = window.getByTestId(switchTestId).getByRole("checkbox");
  if (visibility) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
  await waitForActionSettled(window);
}

async function setFeatureVisibility(
  window: Page,
  viewerObjectType: string,
  feature: string,
  visibility: boolean,
): Promise<void> {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  const switchTestId = `${viewerObjectType}${feature}VisibilitySwitch`;
  await setVisibilityGeneric(window, menuTestId, switchTestId, visibility);
}

async function setFeatureSizeOrWidth(
  window: Page,
  viewerObjectType: string,
  feature: string,
  value: number,
): Promise<void> {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  let sliderTestId = `${viewerObjectType}${feature}SizeSlider`;
  if (feature === "Edges") {
    sliderTestId = `${viewerObjectType}${feature}WidthSlider`;
  }
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const slider = window.getByTestId(sliderTestId);
  await slider
    .locator("input")
    .first()
    .evaluate((node: HTMLInputElement, val: string) => {
      node.value = val;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, value.toString());
  await waitForActionSettled(window);
}

// Specific feature functions
async function setPointsVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  if (viewerObjectType === "model") {
    await setVisibilityGeneric(
      window,
      "modelPointsMenu",
      "modelPointsVisibilitySwitch",
      visibility,
    );
    return;
  }
  await setFeatureVisibility(window, viewerObjectType, "Points", visibility);
}
async function setEdgesVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Edges", visibility);
}
async function setPolygonsVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Polygons", visibility);
}
async function setPolyhedraVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Polyhedra", visibility);
}
async function setCellsVisibility(
  window: Page,
  viewerObjectType: string,
  visibility: boolean,
): Promise<void> {
  await setFeatureVisibility(window, viewerObjectType, "Cells", visibility);
}

async function setPointsSize(window: Page, viewerObjectType: string, value: number): Promise<void> {
  await setFeatureSizeOrWidth(window, viewerObjectType, "Points", value);
}
async function setEdgesWidth(window: Page, viewerObjectType: string, value: number): Promise<void> {
  await setFeatureSizeOrWidth(window, viewerObjectType, "Edges", value);
}

async function resetMenuScroll(window: Page, scrollTop = 0): Promise<void> {
  await window.evaluate((top) => {
    const cardTexts = document.querySelectorAll(".v-card-text");
    for (const cardTextElement of cardTexts) {
      cardTextElement.scrollTop = top;
    }
  }, scrollTop);
}

async function openStyleMenu(window: Page, menuTestId: string): Promise<void> {
  const activeMenuButton = window.getByTestId("activeCircularMenuItemButton");
  if (await activeMenuButton.isVisible()) {
    await activeMenuButton.click();
    await waitForActionSettled(window);
  }
  await ensureMenuOpen(window, menuTestId);
  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

export {
  ensureFeatureVisible,
  ensureMenuOpen,
  openStyleMenu,
  resetMenuScroll,
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsVisibility,
  setPolyhedraVisibility,
  setVisibilityGeneric,
};
