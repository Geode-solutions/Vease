import type { Locator, Page } from "@playwright/test";

import { closeAllMenus, moveMouseOutOfTheWay } from "./app_interaction";
import { getHybridViewerCanvas, getHybridViewerCanvasBoundingBox } from "./viewer_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

async function resetCamera(window: Page): Promise<void> {
  await window.getByTestId("resetCameraButton").click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

const ROTATE_DRAG_STEPS = 20;
// Vtk.js' RenderWindowInteractor turns a pointermove arriving more than 200ms after the previous one into a StartMouseMove, which InteractorStyleTrackballCamera ignores.
// A skipped move mid-drag is caught up by the next handled one (rotation uses the delta from the last handled position), but a skipped final move is lost for good.
// On slow runners (Windows + swiftshader) the last step regularly lands late, leaving the camera one step short of the requested angle.
// Dispatching two moves at the final position within the same task guarantees the second one is handled, so the full delta is always applied.
async function commitPointerPosition(
  hybridViewerCanvas: Locator,
  clientX: number,
  clientY: number,
): Promise<void> {
  await hybridViewerCanvas.evaluate(
    (canvas, position) => {
      for (let index = 0; index < 2; index += 1) {
        canvas.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            buttons: 1,
            clientX: position.x,
            clientY: position.y,
            isPrimary: true,
            pointerId: 1,
            pointerType: "mouse",
          }),
        );
      }
    },
    { x: clientX, y: clientY },
  );
}

async function rotateCamera(
  window: Page,
  deltaX: number,
  deltaY = 0,
  start: { x?: number; y?: number } = {},
): Promise<void> {
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await getHybridViewerCanvasBoundingBox(hybridViewerCanvas);
  const startX = start.x ?? box.x + box.width / 2;
  const startY = start.y ?? box.y + box.height / 2;
  const endX = startX + deltaX;
  const endY = startY + deltaY;
  await window.mouse.move(startX, startY);
  await window.mouse.down();
  await window.mouse.move(endX, endY, { steps: ROTATE_DRAG_STEPS });
  await commitPointerPosition(hybridViewerCanvas, endX, endY);
  await window.mouse.up();
  await waitForActionSettled(window);
}

async function toggleCenterOnClick(window: Page): Promise<void> {
  await window.getByTestId("centerOnClickButton").click();
  await waitForActionSettled(window);
}

async function toggleGridScale(window: Page): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("gridScaleButton").click();
  await waitForActionSettled(window);
}

async function setZScaling(window: Page, zScaleValue: number): Promise<void> {
  await closeAllMenus(window);
  await window.getByTestId("zScalingButton").click();
  await waitForActionSettled(window);

  const panel = window.getByTestId("zScaleInput");
  if (!(await panel.isVisible())) {
    await window.getByTestId("zScalingButton").click();
    await waitForActionSettled(window);
  }

  const input = panel.locator("input");
  await input.fill(zScaleValue.toString());
  await input.press("Enter");
  await waitForActionSettled(window);
  await window.getByTestId("toolPanelActionButton").click();
  await waitForActionSettled(window);
}

async function toggleCameraManager(window: Page): Promise<void> {
  await window.getByTestId("cameraManagerButton").click();
  await waitForActionSettled(window);
}

async function saveCameraPosition(window: Page, name: string): Promise<void> {
  const input = window.getByTestId("cameraPositionNameInput").locator("input");
  await input.fill(name);
  await waitForActionSettled(window);
  await window.getByTestId("saveCameraPositionButton").click();
  await waitForActionSettled(window);
}

async function closeCameraManager(window: Page): Promise<void> {
  await window.getByTestId("closeCameraManagerButton").click();
  await waitForActionSettled(window);
}

async function toggleCameraOrientation(window: Page): Promise<void> {
  await window.getByTestId("cameraOrientationButton").click();
  await waitForActionSettled(window);
}

async function selectCameraOrientation(window: Page, label: string): Promise<void> {
  const vtkKey = label.replace("+", "Plus").replace("-", "Minus");
  await window.getByTestId(`cameraOrientation${vtkKey}Button`).click();
  await waitForActionSettled(window);
}

async function restoreCameraPosition(window: Page, name: string): Promise<void> {
  await window.getByTestId(`restoreCameraPosition${name}Button`).click();
  await waitForActionSettled(window);
}

async function ensureHighlightMenuOpen(window: Page, childButtonTestId: string): Promise<void> {
  if (!(await window.getByTestId(childButtonTestId).isVisible())) {
    await window.getByTestId("highlightOnHoverButton").click();
    await waitForActionSettled(window);
    if (!(await window.getByTestId(childButtonTestId).isVisible())) {
      await window.getByTestId("highlightOnHoverButton").click();
      await waitForActionSettled(window);
    }
  }
}

export {
  setZScaling,
  resetCamera,
  rotateCamera,
  toggleCenterOnClick,
  toggleGridScale,
  toggleCameraManager,
  saveCameraPosition,
  closeCameraManager,
  toggleCameraOrientation,
  selectCameraOrientation,
  restoreCameraPosition,
  ensureHighlightMenuOpen,
};
export {
  toggleShrinkFilter,
  setShrinkFactor,
  resetShrinkFilter,
  toggleShrinkTargetAllVisible,
  selectShrinkDatasets,
  toggleExplodeFilter,
  setExplodeFactor,
  resetExplodeFilter,
  removeExplodeFilter,
  toggleThresholdFilter,
  selectThresholdCellAttribute,
  selectThresholdBlockPolyhedron,
  selectThresholdSurfacePolygon,
  setThresholdMinimum,
  resetThresholdFilter,
  removeThresholdFilter,
} from "./camera_filters";
export {
  toggleRuler,
  toggleRulerSnap,
  setRulerPointInput,
  clearRuler,
  activateZoomToBox,
  drawZoomBox,
} from "./camera_tools";
