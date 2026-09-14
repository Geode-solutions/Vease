import { afterActionWait } from "./constants.js";

function moveMouseOutOfTheWay(window) {
  return window.mouse.move(0, 0);
}
async function closeAllMenus(window) {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
}

export { closeAllMenus, moveMouseOutOfTheWay };
