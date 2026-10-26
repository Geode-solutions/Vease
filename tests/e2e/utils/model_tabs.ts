// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import { waitForActionSettled } from "./wait_for_action_settled";

// Model style cards split their options in tabs: Model | Components Options or Model | Surfaces | Surface
type ModelTab = "model" | "components" | "type" | "component";
const MODEL_TAB_SWITCHES = new Set([
  "modelStyleVisibilitySwitch",
  "modelEdgesVisibilitySwitch",
  "modelPointsVisibilitySwitch",
]);
const COMPONENT_TYPE_TAB_SWITCHES = new Set([
  "modelSurfacesVisibilitySwitch",
  "modelLinesVisibilitySwitch",
  "modelCornersVisibilitySwitch",
  "modelBlocksVisibilitySwitch",
]);

async function selectModelTab(window: Page, tab: ModelTab): Promise<void> {
  const tabButton = window.getByTestId(`modelTab_${tab}`).filter({ visible: true }).first();
  if (await tabButton.isVisible()) {
    await tabButton.click();
    await waitForActionSettled(window);
  }
}

// Component type options when the menu targets a type or a component, else components options
async function selectModelOptionsTab(window: Page): Promise<void> {
  const typeTab = window.getByTestId("modelTab_type").filter({ visible: true }).first();
  await selectModelTab(window, (await typeTab.isVisible()) ? "type" : "components");
}

async function getActiveModelTabTestId(window: Page): Promise<string | undefined> {
  const activeTab = window
    .locator('[data-testid^="modelTab_"].v-btn--active')
    .filter({ visible: true })
    .first();
  if ((await activeTab.count()) === 0) {
    return undefined;
  }
  return (await activeTab.getAttribute("data-testid")) ?? undefined;
}

async function restoreModelTab(window: Page, tabTestId: string | undefined): Promise<void> {
  if (tabTestId === undefined) {
    return;
  }
  await window.getByTestId(tabTestId).filter({ visible: true }).first().click();
  await waitForActionSettled(window);
}

export {
  COMPONENT_TYPE_TAB_SWITCHES,
  MODEL_TAB_SWITCHES,
  getActiveModelTabTestId,
  restoreModelTab,
  selectModelOptionsTab,
  selectModelTab,
};
