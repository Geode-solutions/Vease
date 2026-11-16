// Node imports

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import {
  getModelComponentsObjectTree,
  openModelComponentsTree,
} from "#ogw_e2e/object_trees/model_components_object_tree.js";
import { brepGeodeObjectType } from "#ogw_e2e/constants.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

// Constants
const brepFilename = "test.og_brep";
const brepName = "test";
// Longer than the delay before a hovered model is highlighted in the viewer
const HIGHLIGHT_DELAY_MS = 500;
// Distance between the header hovered and the close button, on its left
const CLOSE_BUTTON_MARGIN_PX = 40;
const HEADER_MIDDLE_PX = 16;

function getModelTreeBox(window: Page): Locator {
  return window.locator(".tree-box").filter({ has: getModelComponentsObjectTree(window) });
}

// Hovers the header right next to the close button, the way one aims at it
async function hoverNextToCloseButton(window: Page): Promise<void> {
  const header = getModelTreeBox(window).locator(".tree-box-header");
  const box = await header.boundingBox();
  if (box === null) {
    throw new Error("The model tree header is not displayed.");
  }
  await header.hover({
    position: { x: box.width - CLOSE_BUTTON_MARGIN_PX, y: HEADER_MIDDLE_PX },
  });
  await window.waitForTimeout(HIGHLIGHT_DELAY_MS);
  await waitForActionSettled(window);
}

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load a model and open its model tree", async ({ window }) => {
  test.slow();
  await loadVeaseTestDatas(window, [brepFilename]);
  await openModelComponentsTree(window, brepGeodeObjectType, brepName);
  await expect(getModelTreeBox(window)).toBeVisible();
});

test("hovering the model tree header highlights the model", async ({ window }) => {
  await hoverNextToCloseButton(window);
  await expect(getModelTreeBox(window)).toHaveClass(/is-highlighted/u);
});

// The close button is inside the hovered header: the box is removed under the cursor and no mouseleave is sent
test("closing the hovered model tree stops the highlight", async ({ window }) => {
  await getModelTreeBox(window).locator(".tree-box-header").getByRole("button").click();
  await expect(getModelTreeBox(window)).toBeHidden();
  await waitForActionSettled(window);
});

test("reopening the model tree shows it not highlighted", async ({ window }) => {
  await openModelComponentsTree(window, brepGeodeObjectType, brepName);
  await expect(getModelTreeBox(window)).toBeVisible();
  await expect(getModelTreeBox(window)).not.toHaveClass(/is-highlighted/u);
});
