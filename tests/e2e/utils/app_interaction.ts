import { type Page, expect } from "@playwright/test";
import { waitForActionSettled } from "./wait_for_action_settled";

async function moveMouseOutOfTheWay(window: Page): Promise<void> {
  await window.mouse.move(0, 0);
}
async function closeAllMenus(window: Page): Promise<void> {
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

// Snackbars auto-dismiss after 10s (see feedback store), which is too slow to rely on between tests.
async function closeFeedbackSnackbar(window: Page): Promise<void> {
  await window.getByTestId("feedbackSnackbar").getByRole("button").click();
  await expect(window.getByTestId("feedbackSnackbar")).not.toBeVisible();
}

export { closeAllMenus, closeFeedbackSnackbar, moveMouseOutOfTheWay };
