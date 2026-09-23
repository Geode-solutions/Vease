import type { Page } from "@playwright/test";
import { waitForActionSettled } from "./wait_for_action_settled";

async function moveMouseOutOfTheWay(window: Page): Promise<void> {
  await window.mouse.move(0, 0);
}
async function closeAllMenus(window: Page): Promise<void> {
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

export { closeAllMenus, moveMouseOutOfTheWay };
