import type { Locator, Page } from "@playwright/test";
import { ensureFeatureVisible, ensureMenuOpen } from "@vease_tests/utils/viewer_interaction";
import { applyAttribute } from "@vease_tests/utils/data/helpers/attribute";
import { selectModelTab } from "@vease_tests/utils/model_tabs";
import { setColor } from "@vease_tests/utils/data/helpers/color";
import { vertexAttributeType } from "@vease_tests/utils/constants";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

const modelEdgesMenuTestId = "modelEdgesMenu";

// Sections of the model edges card, shown depending on what the context menu targets
type ModelEdgesSection =
  | "modelEdgesComponentsOptions"
  | "modelEdgesComponentTypeOptions"
  | "modelEdgesComponentOptions";

interface AttributeOptions {
  item?: number;
  colorMap?: string;
  min?: number | string;
  max?: number | string;
}

function getModelEdgesSection(window: Page, section: ModelEdgesSection): Locator {
  return window.getByTestId(section).filter({ visible: true }).first();
}

const SECTION_TABS = {
  modelEdgesComponentsOptions: "components",
  modelEdgesComponentTypeOptions: "type",
  modelEdgesComponentOptions: "component",
} as const;

async function setModelComponentsEdgesVisibility(
  window: Page,
  section: ModelEdgesSection,
  visibility: boolean,
): Promise<void> {
  await ensureMenuOpen(window, modelEdgesMenuTestId);
  await ensureFeatureVisible(window, modelEdgesMenuTestId);
  await selectModelTab(window, SECTION_TABS[section]);
  const visibilitySwitch = getModelEdgesSection(window, section)
    .getByTestId("modelComponentEdgesVisibilitySwitch")
    .getByRole("checkbox");
  if ((await visibilitySwitch.isChecked()) !== visibility) {
    await visibilitySwitch.setChecked(visibility, { force: true });
    await waitForActionSettled(window);
  }
}

async function setModelComponentsEdgesWidth(
  window: Page,
  section: ModelEdgesSection,
  value: number,
): Promise<void> {
  await setModelComponentsEdgesVisibility(window, section, true);
  await getModelEdgesSection(window, section)
    .getByTestId("modelComponentEdgesWidthSlider")
    .locator("input")
    .first()
    .evaluate((node: HTMLInputElement, val: string) => {
      node.value = val;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, value.toString());
  await waitForActionSettled(window);
}

async function setModelComponentsEdgesColor(
  window: Page,
  section: ModelEdgesSection,
): Promise<void> {
  await setModelComponentsEdgesVisibility(window, section, true);
  await setColor(window, modelEdgesMenuTestId, getModelEdgesSection(window, section));
}

async function setModelComponentsEdgesVertexAttribute(
  window: Page,
  section: ModelEdgesSection,
  attributeName: string,
  options: AttributeOptions = {},
): Promise<void> {
  await setModelComponentsEdgesVisibility(window, section, true);
  await applyAttribute(window, getModelEdgesSection(window, section), {
    attributeType: vertexAttributeType,
    attributeName,
    ...options,
  });
}

export {
  setModelComponentsEdgesColor,
  setModelComponentsEdgesWidth,
  setModelComponentsEdgesVertexAttribute,
  setModelComponentsEdgesVisibility,
};
export type { ModelEdgesSection };
