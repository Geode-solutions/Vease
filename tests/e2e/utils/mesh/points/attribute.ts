import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
} from "@tests/utils/helpers/color_picker";
import {
  afterActionWait,
  ensureMenuOpen,
  moveMouseOutOfTheWay,
  openStyleMenu,
} from "@tests/utils/viewer_interaction";
import {
  meshViewerObjectType,
  pointsFeatureName,
  vertexAttributeType,
} from "@tests/utils/constants";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";

function setMeshPointsVertexAttribute(window, attributeName, options = {}) {
  return setFeatureAttribute(
    window,
    meshViewerObjectType,
    pointsFeatureName,
    vertexAttributeType,
    attributeName,
    options,
  );
}

function openMeshPointsMenu(window) {
  const menuTestId = `${meshViewerObjectType}${pointsFeatureName}Menu`;
  return openStyleMenu(window, menuTestId);
}

async function setMeshPointsNoDataColor(window) {
  const menuTestId = `${meshViewerObjectType}${pointsFeatureName}Menu`;
  await ensureMenuOpen(window, menuTestId);
  const noDataColorBtn = window.getByTestId("noDataColorBtn").first();
  await noDataColorBtn.waitFor({ state: "visible" });
  await noDataColorBtn.click();
  await window.waitForTimeout(afterActionWait);
  await window
    .getByTestId("colorPicker")
    .filter({ visible: true })
    .first()
    .waitFor({ state: "visible" });
  await clickColorPickerSlider(window, SLIDER_PINK);
  await clickColorPickerCanvas(window);
  await noDataColorBtn.click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

export { openMeshPointsMenu, setMeshPointsVertexAttribute, setMeshPointsNoDataColor };
