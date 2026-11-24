// Node imports

// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import { getDataTableRow } from "./data_manager";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

async function expectDataRows(window: Page, itemNames: string[]): Promise<void> {
  // oxlint-disable no-await-in-loop
  for (const itemName of itemNames) {
    await expect(getDataTableRow(window, itemName)).toBeVisible();
  }
  // oxlint-enable no-await-in-loop
}

async function openCrsByButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("crsCell").click();
  await waitForActionSettled(window);
}

async function expectRowCrs(window: Page, itemName: string, expected: string): Promise<void> {
  await expect(getDataTableRow(window, itemName).getByTestId("crsCell")).toContainText(expected);
}

export { expectDataRows, expectRowCrs, openCrsByButton };
