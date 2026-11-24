// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

// The star of a CRS row adds it to the favorites, kept as a chip above the search
async function toggleFavoriteCrs(window: Page, crsName: string): Promise<void> {
  await window.getByTestId("crsSearchInput").locator("input").fill(crsName);
  await window
    .locator("tbody tr")
    .filter({ hasText: crsName })
    .first()
    .getByTestId("crsFavoriteToggle")
    .click();
  await waitForActionSettled(window);
}

async function expectCrsChip(
  window: Page,
  kind: "crsFavoriteChip" | "crsRecentChip",
  code: string,
): Promise<void> {
  await expect(window.getByTestId(kind).filter({ hasText: code })).toBeVisible();
}

export { expectCrsChip, toggleFavoriteCrs };
