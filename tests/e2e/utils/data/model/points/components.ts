import type { Locator, Page } from "@playwright/test";
import { ensureFeatureVisible, ensureMenuOpen } from "@vease_tests/utils/viewer_interaction";
import { applyAttribute } from "@vease_tests/utils/data/helpers/attribute";
import { selectModelTab } from "@vease_tests/utils/model_tabs";
import { setColor } from "@vease_tests/utils/data/helpers/color";
import { vertexAttributeType } from "@vease_tests/utils/constants";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

const modelPointsMenuTestId = "modelPointsMenu";

// Sections of the model points card, shown depending on what the context menu targets
type ModelPointsSection =
  | "modelPointsComponentsOptions"
  | "modelPointsComponentTypeOptions"
  | "modelPointsComponentOptions";

interface AttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

function getModelPointsSection(window: Page, section: ModelPointsSection): Locator {
  return window.getByTestId(section).filter({ visible: true }).first();
}

const SECTION_TABS = {
  modelPointsComponentsOptions: "components",
  modelPointsComponentTypeOptions: "type",
  modelPointsComponentOptions: "component",
} as const;

async function setModelComponentsPointsVisibility(
  window: Page,
  section: ModelPointsSection,
  visibility: boolean,
): Promise<void> {
  await ensureMenuOpen(window, modelPointsMenuTestId);
  await ensureFeatureVisible(window, modelPointsMenuTestId);
  await selectModelTab(window, SECTION_TABS[section]);
  const visibilitySwitch = getModelPointsSection(window, section)
    .getByTestId("modelComponentPointsVisibilitySwitch")
    .getByRole("checkbox");
  if ((await visibilitySwitch.isChecked()) !== visibility) {
    await visibilitySwitch.setChecked(visibility, { force: true });
    await waitForActionSettled(window);
  }
}

async function setModelComponentsPointsSize(
  window: Page,
  section: ModelPointsSection,
  value: number,
): Promise<void> {
  await setModelComponentsPointsVisibility(window, section, true);
  await getModelPointsSection(window, section)
    .getByTestId("modelComponentPointsSizeSlider")
    .locator("input")
    .first()
    .evaluate((node: HTMLInputElement, val: string) => {
      node.value = val;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, value.toString());
  await waitForActionSettled(window);
}

async function setModelComponentsPointsColor(
  window: Page,
  section: ModelPointsSection,
): Promise<void> {
  await setModelComponentsPointsVisibility(window, section, true);
  await setColor(window, modelPointsMenuTestId, getModelPointsSection(window, section));
}

async function setModelComponentsPointsVertexAttribute(
  window: Page,
  section: ModelPointsSection,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setModelComponentsPointsVisibility(window, section, true);
  await applyAttribute(window, getModelPointsSection(window, section), {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

export {
  setModelComponentsPointsColor,
  setModelComponentsPointsSize,
  setModelComponentsPointsVertexAttribute,
  setModelComponentsPointsVisibility,
};
export type { ModelPointsSection };
