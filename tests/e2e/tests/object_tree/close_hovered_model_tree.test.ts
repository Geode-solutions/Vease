// Node imports

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import { brepGeodeObjectType } from "#ogw_e2e/constants.js";
import { expandGeodeObjectType } from "#ogw_e2e/object_trees/main_object_tree.js";
import { getModelComponentsObjectTree } from "#ogw_e2e/object_trees/model_components_object_tree.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
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

function getModelTreeBoxes(window: Page): Locator {
  return window.locator(".tree-box").filter({ has: getModelComponentsObjectTree(window) });
}

// Hovers the header right next to the close button, the way one aims at it
async function hoverNextToCloseButton(window: Page, boxIndex = 0): Promise<void> {
  const header = getModelTreeBoxes(window).nth(boxIndex).locator(".tree-box-header");
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

test("open both model trees", async ({ window }) => {
  test.slow();
  await loadVeaseTestDatas(window, [brepFilename]);
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandGeodeObjectType(window, brepGeodeObjectType);
  const rows = window
    .getByTestId("mainObjectTree")
    .getByTestId("treeRowWrapper")
    .filter({ hasText: brepName });
  await expect(rows).toHaveCount(2);
  await rows.first().getByTestId("expandModelComponentsButton").click();
  await waitForActionSettled(window);
  await rows.nth(1).getByTestId("expandModelComponentsButton").click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
  await expect(getModelTreeBoxes(window)).toHaveCount(2);
});

test("hovering the model tree header highlights the model", async ({ window }) => {
  await hoverNextToCloseButton(window, 0);
  await expect(getModelTreeBoxes(window).first()).toHaveClass(/is-highlighted/u);
});

// The close button is inside the hovered header: the box is removed under the cursor and no mouseleave is sent
test("closing the hovered model tree stops the highlight", async ({ window }) => {
  await getModelTreeBoxes(window).first().locator(".tree-box-header").getByRole("button").click();
  await expect(getModelTreeBoxes(window)).toHaveCount(1);
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
});

test("reopening the model tree shows it not highlighted", async ({ window }) => {
  const rows = window
    .getByTestId("mainObjectTree")
    .getByTestId("treeRowWrapper")
    .filter({ hasText: brepName });
  await rows.first().getByTestId("expandModelComponentsButton").click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
  await expect(getModelTreeBoxes(window)).toHaveCount(2);
  await expect(getModelTreeBoxes(window).first()).not.toHaveClass(/is-highlighted/u);
  await expect(getModelTreeBoxes(window).nth(1)).not.toHaveClass(/is-highlighted/u);
});
