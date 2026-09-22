import type { Page } from "@playwright/test";
import { afterActionWait } from "./constants";

async function moveMouseOutOfTheWay(window: Page): Promise<void> {
  await window.mouse.move(0, 0);
}
async function closeAllMenus(window: Page): Promise<void> {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
}

export { closeAllMenus, moveMouseOutOfTheWay };
