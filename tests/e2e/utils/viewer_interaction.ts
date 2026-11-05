// Third party imports
import type { Page } from "@playwright/test";

// Local imports
// oxlint-disable-next-line unicorn/prefer-export-from
import { afterActionWait, halfSecondWait } from "./constants";
// oxlint-disable-next-line unicorn/prefer-export-from
import { closeFeedbackSnackbar, moveMouseOutOfTheWay } from "./app_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

function noopCleanup(): unknown {
  return undefined;
}

async function findOverlappingObjectsPicker(window: Page): Promise<void> {
  let found = false;
  const points = [
    { x: 440, y: 530 },
    { x: 600, y: 400 },
    { x: 600, y: 500 },
    { x: 600, y: 300 },
    { x: 500, y: 400 },
    { x: 700, y: 400 },
    { x: 550, y: 450 },
    { x: 650, y: 350 },
    { x: 650, y: 450 },
    { x: 550, y: 350 },
    { x: 400, y: 400 },
    { x: 800, y: 400 },
    { x: 450, y: 550 },
    { x: 500, y: 500 },
  ];

  for (const { x, y } of points) {
    // oxlint-disable-next-line no-await-in-loop
    await window.getByTestId("hybridViewer").locator("canvas").click({
      button: "right",
      position: { x, y },
      delay: 100,
    });
    // oxlint-disable-next-line no-await-in-loop
    await waitForActionSettled(window);

    // oxlint-disable-next-line no-await-in-loop
    const items = await window.locator(".intermediate-picker-item").count();
    if (items >= 2) {
      found = true;
      break;
    }
    // oxlint-disable-next-line no-await-in-loop
    await window.keyboard.press("Escape");
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(halfSecondWait);
  }

  if (!found) {
    throw new Error(
      "Could not find overlapping objects picker anywhere! The test data might not be loaded or the picker is broken.",
    );
  }
}

export {
  afterActionWait,
  noopCleanup,
  closeFeedbackSnackbar,
  findOverlappingObjectsPicker,
  moveMouseOutOfTheWay,
};
export {
  dragContextMenu,
  dragElement,
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  getQuickColormapPicker,
  hoverViewer,
  stabilizeHoverTooltip,
  toggleInfoCard,
  viewerContextMenu,
  viewerQuickColormap,
} from "./viewer_canvas";
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
} from "./viewer_menu";
