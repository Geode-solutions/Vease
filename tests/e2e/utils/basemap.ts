// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import {
  expandGeodeObjectType,
  getMainObjectTree,
  openDataContextMenu,
  openGeodeObjectTypeContextMenu,
} from "./object_trees/main_object_tree";
import { hoverViewer, moveMouseOutOfTheWay } from "./viewer_interaction";
import { getTreeRowByTextAndParent } from "./object_trees/common";
import { waitForActionSettled } from "./wait_for_action_settled";

type MapTitle = "Satellite" | "Plan" | "Routes";
const BASEMAP = "Basemap";
const OPACITY_STEP = 5;
const ZOOM_WHEEL_DELTA = -300;
// Longer than the rest delay of the basemap detail store: its request has started
const DETAIL_REST_MILLISECONDS = 500;
const FULL_OPACITY = 100;

// The Basemap category only joins the tree once the project has a CRS
async function expectNoBasemapInTree(window: Page): Promise<void> {
  const tree = getMainObjectTree(window);
  await expect(tree).toBeVisible();
  await expect(tree.getByTestId("treeRowWrapper").filter({ hasText: BASEMAP })).toHaveCount(0);
}

// A map eye shows or hides that map, over or under the other visible maps.
// The category eye hides the visible maps, or shows the last maps again
async function toggleBasemap(window: Page, title?: MapTitle): Promise<void> {
  await expandGeodeObjectType(window, BASEMAP);
  const row = await getTreeRowByTextAndParent(window, BASEMAP, title, getMainObjectTree(window));
  // The eye test id follows its state: visible, hidden or indeterminate
  await row.locator('[data-testid$="ObjectEyeButton"]').first().click({ force: true });
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

async function openBasemapMenu(window: Page, menuTestId: string, title?: MapTitle): Promise<void> {
  if (title === undefined) {
    // Expanded as from a map menu: the tree looks the same in the screenshots
    await expandGeodeObjectType(window, BASEMAP);
    await openGeodeObjectTypeContextMenu(window, BASEMAP);
  } else {
    await openDataContextMenu(window, BASEMAP, title);
  }
  await window.getByTestId(menuTestId).getByTestId("circularMenuItemButton").click();
  await waitForActionSettled(window);
}

// Keyboard steps from full opacity: a drag would depend on the slider width
async function setBasemapOpacity(window: Page, title: MapTitle, percent: number): Promise<void> {
  await openBasemapMenu(window, "basemapOpacityMenu", title);
  const slider = window.getByTestId("basemapOpacity").getByRole("slider");
  await slider.focus();
  await window.keyboard.press("End");
  // oxlint-disable no-await-in-loop
  for (let value = FULL_OPACITY; value > percent; value -= OPACITY_STEP) {
    await window.keyboard.press("ArrowLeft");
  }
  // oxlint-enable no-await-in-loop
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

// From a map menu, crops that map; from the category menu, crops every map
async function toggleBasemapCrop(window: Page, title?: MapTitle): Promise<void> {
  await openBasemapMenu(window, "basemapCropMenu", title);
  await window.getByTestId("basemapCrop").locator("input").click();
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

// Zooms on the viewer centre, then waits for the sharper map of the visible area
async function zoomAndRest(window: Page, steps: number): Promise<void> {
  await hoverViewer(window);
  // oxlint-disable no-await-in-loop
  for (let step = 0; step < steps; step += 1) {
    await window.mouse.wheel(0, ZOOM_WHEEL_DELTA);
  }
  // oxlint-enable no-await-in-loop
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(DETAIL_REST_MILLISECONDS);
  await waitForActionSettled(window);
}

export { expectNoBasemapInTree, setBasemapOpacity, toggleBasemap, toggleBasemapCrop, zoomAndRest };
