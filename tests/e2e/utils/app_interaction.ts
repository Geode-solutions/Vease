import { type Page, expect } from "@playwright/test";
import { waitForActionSettled } from "./wait_for_action_settled";

async function moveMouseOutOfTheWay(window: Page): Promise<void> {
  await window.mouse.move(0, 0);
}
async function closeAllMenus(window: Page): Promise<void> {
  await window.keyboard.press("Escape");
  await waitForActionSettled(window);
}

const CLOSE_SNACKBAR_TIMEOUT_MS = 2000;

// Snackbars auto-dismiss after 10s (see feedback store), which is too slow to rely on between tests.
// Not every action produces a snackbar (e.g. a successful visibility toggle doesn't), so only close it if present.
// Some actions stack several (e.g. an assign with an implausible CRS warning): all of them are closed.
async function closeFeedbackSnackbar(window: Page): Promise<void> {
  const snackbars = window.getByTestId("feedbackSnackbar");
  // Each close removes a snackbar: they must be closed one after another
  // oxlint-disable no-await-in-loop
  while ((await snackbars.count()) > 0) {
    const count = await snackbars.count();
    // The snackbar may auto-dismiss between the count and the click: its button is then gone for good
    await snackbars
      .first()
      .getByTestId("feedbackCloseBtn")
      .click({ force: true, timeout: CLOSE_SNACKBAR_TIMEOUT_MS })
      .catch(() => undefined);
    // Several may leave at once (closed and auto-dismissed): only require that one is gone
    await expect(snackbars).not.toHaveCount(count);
  }
  // oxlint-enable no-await-in-loop
}

export { closeAllMenus, closeFeedbackSnackbar, moveMouseOutOfTheWay };
