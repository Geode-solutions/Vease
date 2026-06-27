import { afterActionWait } from "./viewer_interaction.js";

async function openCreateToolsPanel(window) {
  await window.getByTestId("createButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function selectCreateTool(window, toolId) {
  await window.getByTestId(`createToolCard-${toolId}`).click();
  await window.waitForTimeout(afterActionWait);
}

async function fillPointCoords(window, index, x, y, z) {
  const row = window.getByTestId(`point-${index}`);
  const inputs = row.locator("input");
  await inputs.nth(0).fill(x.toString());
  await window.waitForTimeout(afterActionWait);
  await inputs.nth(1).fill(y.toString());
  await window.waitForTimeout(afterActionWait);
  await inputs.nth(2).fill(z.toString());
  await window.waitForTimeout(afterActionWait);
}

async function addPointRow(window) {
  await window.getByTestId("addPointButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function fillPointsCoords(window, coords) {
  async function fillNext(index) {
    if (index >= coords.length) {
      return;
    }
    const row = window.getByTestId(`point-${index}`);
    if ((await row.count()) === 0) {
      await addPointRow(window);
    }
    const { x, y, z } = coords[index];
    await fillPointCoords(window, index, x, y, z);
    await fillNext(index + 1);
  }
  await fillNext(0);
}

async function clickPickButton(window) {
  await window.getByTestId("pickButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function pickPointInViewer(window, x, y) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  await canvas.click({
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
}

async function submitCreateObject(window) {
  await window.getByTestId("submitButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function closePickingBanner(window) {
  await window.getByTestId("pickingActiveChip").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleClosedCurve(window) {
  await window.getByTestId("closedCurveCheckbox").getByRole("checkbox").check();
  await window.waitForTimeout(afterActionWait);
}

export {
  openCreateToolsPanel,
  selectCreateTool,
  fillPointCoords,
  fillPointsCoords,
  addPointRow,
  clickPickButton,
  pickPointInViewer,
  submitCreateObject,
  closePickingBanner,
  toggleClosedCurve,
};
