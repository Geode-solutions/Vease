import type { Locator, Page } from "@playwright/test";
import {
  ensureFeatureVisible,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
} from "@vease_tests/utils/viewer_interaction";
import { getMenuContainer, resetMenuScroll } from "@vease_tests/utils/data/helpers/attribute_menu";
import { setFeatureColorMap } from "@vease_tests/utils/data/helpers/attribute_colors";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

async function setFeatureItem(
  window: Page,
  menuTestId: string | Locator,
  item: number,
): Promise<void> {
  const container = getMenuContainer(window, menuTestId);
  const itemSelector = container.getByTestId("itemSelector").first();
  await itemSelector.waitFor({ state: "visible" });
  await itemSelector.click();
  await waitForActionSettled(window);

  const itemText = `Item ${item + 1}`;
  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: itemText, visible: true })
    .first()
    .click();
  await waitForActionSettled(window);
  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
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
  await waitForActionSettled(window);

  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: attributeType, visible: true })
    .first()
    .click();
  await waitForActionSettled(window);

  const attributeSelector = container.getByTestId("attributeSelector").first();
  await attributeSelector.waitFor({ state: "visible" });
  await attributeSelector.click();
  await waitForActionSettled(window);

  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: attributeName, visible: true })
    .first()
    .click();
  await waitForActionSettled(window);

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
    await waitForActionSettled(window);
  }
  if (max !== undefined) {
    const input = container.getByTestId("attributeMaxInput").first().locator("input");
    await input.fill(max.toString());
    await input.press("Enter");
    await waitForActionSettled(window);
  }
  await resetMenuScroll(window, 0);
  await waitForActionSettled(window);
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

async function setFeatureTimeStep(
  window: Page,
  menuTestId: string | Locator,
  timeStep: number,
): Promise<void> {
  if (typeof menuTestId === "string") {
    await ensureMenuOpen(window, menuTestId);
  }
  const container = getMenuContainer(window, menuTestId);
  const sliderThumb = container.getByTestId("timeStepSlider").first().getByRole("slider");
  await sliderThumb.waitFor({ state: "visible" });
  await sliderThumb.focus();
  await sliderThumb.press("Home");
  for (let step = 0; step < timeStep; step += 1) {
    // oxlint-disable-next-line no-await-in-loop -- each key press moves the slider by one step
    await sliderThumb.press("ArrowRight");
  }
  await waitForActionSettled(window);
  // Keyboard focus keeps the thumb label visible: release it before the screenshot
  await sliderThumb.blur();
  await resetMenuScroll(window, 0);
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

export { resetMenuScroll } from "@vease_tests/utils/data/helpers/attribute_menu";
export {
  setFeatureColorMap,
  setFeatureNoDataColor,
  setQuickColorMap,
} from "@vease_tests/utils/data/helpers/attribute_colors";
export { applyAttribute, setFeatureAttribute, setFeatureItem, setFeatureTimeStep };
