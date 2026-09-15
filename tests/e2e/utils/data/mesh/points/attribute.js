import {
  SLIDER_PINK,
  clickColorPickerCanvas,
  clickColorPickerSlider,
<<<<<<<< HEAD:tests/e2e/utils/data/mesh/points/attribute.js
} from "@tests/utils/data/helpers/color_picker.js";
========
} from "@tests/utils/helpers/color_picker";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/mesh/points/attribute.ts
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
<<<<<<<< HEAD:tests/e2e/utils/data/mesh/points/attribute.js
} from "@tests/utils/constants.js";
import { setFeatureAttribute } from "@tests/utils/data/helpers/attribute.js";
========
} from "@tests/utils/constants";
import { setFeatureAttribute } from "@tests/utils/helpers/attribute";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/mesh/points/attribute.ts

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

export { openMeshPointsMenu, setMeshPointsNoDataColor, setMeshPointsVertexAttribute };
