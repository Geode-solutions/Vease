// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import { closeFeedbackSnackbar, moveMouseOutOfTheWay } from "#ogw_e2e/viewer_interaction.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { resetCamera } from "#ogw_e2e/camera_interaction.js";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

// Constants
const BREP_FILE = "test.og_brep";
// Not a zip archive: the back cannot load it as a BRep
const BROKEN_FILE = "broken.og_brep";
const BROKEN_CONTENT = "This is not an OpenGeode BRep\n";
const SCROLLED_DOWN_PX = 200;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

function activityRows(window: Page): Locator {
  return window.getByTestId("activity").getByTestId("activityRow");
}

function unseenErrorsBadge(window: Page): Locator {
  return window.getByTestId("activityNavButtonBadge").locator(".v-badge__badge");
}

async function openActivity(window: Page): Promise<void> {
  await window.getByTestId("activityNavButton").click();
  await expect(window.getByTestId("activity")).toBeVisible();
}

// Times, durations, counts and temporary paths change at every run
function maskRunDetails(window: Page, locators: Locator[]): void {
  locators.push(
    window.locator(".activity-row__time"),
    window.locator(".activity-row__duration"),
    window.locator(".activity-detail"),
    window.locator(".activity-foot"),
  );
}

// The id of the first row shown in the list
async function firstVisibleRowId(window: Page): Promise<string | undefined> {
  const rowId = await window.locator(".activity-list").evaluate((list) => {
    for (const row of list.querySelectorAll<HTMLElement>("[data-entry-id]")) {
      if (row.offsetTop + row.offsetHeight > list.scrollTop) {
        return row.dataset.entryId;
      }
    }
    return undefined;
  });
  return rowId;
}

// Hides every source but the back. The app source only logs the launch of the microservices by the app server:
// On cloud they already run, so there is no app chip
async function showOnlyBackSource(window: Page, mode: string): Promise<void> {
  await window.getByTestId("activitySource-viewer").click();
  if (mode !== "CLOUD") {
    await window.getByTestId("activitySource-app").click();
  }
}

test("an import shows up in the activity panel", async ({ window, mode, screenshotMask }) => {
  await loadVeaseTestDatas(window, [BREP_FILE]);
  await openActivity(window);
  await expect(activityRows(window).filter({ hasText: "upload_file" }).first()).toBeVisible();
  await expect(
    activityRows(window).filter({ hasText: "save_viewable_file" }).first(),
  ).toBeVisible();
  // The back requests of an import run one after the other: the same lines at every run
  await showOnlyBackSource(window, mode);
  await moveMouseOutOfTheWay(window);
  maskRunDetails(window, screenshotMask.locators);
});

test("a failed import shows on the activity button", async ({ window }, testInfo) => {
  await window.getByTestId("activityCloseButton").click();
  const inputDataPath = testInfo.outputPath("data");
  fs.mkdirSync(inputDataPath, { recursive: true });
  fs.writeFileSync(path.join(inputDataPath, BROKEN_FILE), BROKEN_CONTENT);
  await loadVeaseTestDatas(window, [BROKEN_FILE], { inputDataPath });
  await expect(window.getByTestId("feedbackSnackbar").first()).toBeVisible();
  await closeFeedbackSnackbar(window);
  await expect(unseenErrorsBadge(window)).toHaveText("1");
  await moveMouseOutOfTheWay(window);
});

test("the activity panel shows the error and clears the badge", async ({
  window,
  screenshotMask,
}) => {
  await openActivity(window);
  await expect(unseenErrorsBadge(window)).toBeHidden();
  await window.getByTestId("activityStatus-errors").click();
  await expect(activityRows(window)).toHaveCount(1);
  await activityRows(window).first().click();
  await expect(window.locator(".activity-detail")).toContainText("Cannot load BRep");
  await moveMouseOutOfTheWay(window);
  maskRunDetails(window, screenshotMask.locators);
});

// Reopened at the previous test, the panel shows every source again
test("a source chip hides its lines", async ({ window, screenshotMask }) => {
  await window.getByTestId("activityStatus-all").click();
  const backSources = window.getByTestId("activity").locator(".src--back");
  await expect(backSources.first()).toBeVisible();
  await window.getByTestId("activitySource-back").click();
  await expect(backSources).toHaveCount(0);
  await expect(window.getByTestId("activity").locator(".src--viewer").first()).toBeVisible();
  await moveMouseOutOfTheWay(window);
  // The viewer requests of a render run in parallel: their order changes between runs
  screenshotMask.locators.push(window.locator(".activity-list"));
});

test("scrolled down, new lines wait behind the back to top button", async ({
  window,
  screenshotMask,
}) => {
  const list = window.locator(".activity-list");
  const backToTop = window.getByTestId("activityBackToTop");
  await list.evaluate((element, scrollTop) => {
    element.scrollTop = scrollTop;
  }, SCROLLED_DOWN_PX);
  await expect(backToTop).toHaveText("Back to top");
  const rowBefore = await firstVisibleRowId(window);

  await resetCamera(window);
  await waitForActionSettled(window);

  await expect(backToTop).toHaveText(/\d+ new/u);
  expect(await firstVisibleRowId(window)).toBe(rowBefore);
  await backToTop.click();
  await expect(backToTop).toBeHidden();
  expect(await list.evaluate((element) => element.scrollTop)).toBe(0);
  await moveMouseOutOfTheWay(window);
  screenshotMask.locators.push(list);
});
