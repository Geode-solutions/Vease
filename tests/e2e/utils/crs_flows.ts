// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import {
  brepGeodeObjectType,
  edgedCurveGeodeObjectType,
  pointSetGeodeObjectType,
} from "#ogw_e2e/constants.js";
import {
  clickAssign,
  confirmConvert,
  expectRowCrs,
  fillAlignPoints,
  openCrsByButton,
  selectAlignmentCrs,
  selectAssignMode,
  selectConvertMode,
  selectCrs,
  selectScope,
} from "./crs";
import { closeFeedbackSnackbar, moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import { navigateToDataManagerPage } from "./navigate";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

async function closeCrsDialog(window: Page): Promise<void> {
  await window.keyboard.press("Escape");
  await moveMouseOutOfTheWay(window);
}

async function expectEveryRowCrs(window: Page, expected: string): Promise<void> {
  await expectRowCrs(window, pointSetGeodeObjectType, expected);
  await expectRowCrs(window, brepGeodeObjectType, expected);
  await expectRowCrs(window, edgedCurveGeodeObjectType, expected);
}

async function fillAlignment(
  window: Page,
  source: { x: number; y: number }[],
  target: { x: number; y: number }[],
  crsName: string,
): Promise<void> {
  await fillAlignPoints(window, "crsAlignSource", source);
  await fillAlignPoints(window, "crsAlignTarget", target);
  await selectAlignmentCrs(window, crsName);
}

async function convertAloneTo(
  window: Page,
  geodeObjectType: string,
  crsName: string,
): Promise<void> {
  await navigateToDataManagerPage(window);
  await openCrsByButton(window, geodeObjectType);
  await selectConvertMode(window);
  await selectScope(window, "one");
  await selectCrs(window, crsName);
  await confirmConvert(window);
  await moveMouseOutOfTheWay(window);
}

async function startMisfitAssign(
  window: Page,
  geodeObjectType: string,
  crsName: string,
): Promise<void> {
  await openCrsByButton(window, geodeObjectType);
  await selectAssignMode(window);
  await selectCrs(window, crsName);
  await clickAssign(window);
}

async function assignAnywayToAll(window: Page, crsName: string): Promise<void> {
  await selectAssignMode(window);
  await selectScope(window, "all");
  await selectCrs(window, crsName);
  await clickAssign(window);
  await window.getByTestId("crsAssignAnyway").click();
  await waitForActionSettled(window);
  await closeFeedbackSnackbar(window);
  await moveMouseOutOfTheWay(window);
}

export {
  assignAnywayToAll,
  closeCrsDialog,
  convertAloneTo,
  expectEveryRowCrs,
  fillAlignment,
  startMisfitAssign,
};
