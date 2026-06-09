// Node imports

// Third party imports

// Local imports
import { afterActionWait } from "./viewer_interaction.js";

async function resetCamera(window) {
  await window.getByTestId("resetCameraButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function rotateCamera(window, deltaX, deltaY = 0) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  const box = await canvas.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  await window.mouse.move(centerX, centerY);
  await window.mouse.down({ button: "left" });
  await window.mouse.move(centerX + deltaX, centerY + deltaY, { steps: 20 });
  await window.mouse.up({ button: "left" });

  await window.waitForTimeout(afterActionWait);
}

export { resetCamera, rotateCamera };
