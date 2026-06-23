import { afterActionWait } from "./viewer_interaction.js";

async function expandAllObjects(window) {
  await window.getByTestId("expandAllObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function collapseAllObjects(window) {
  await window.getByTestId("collapseAllObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function toggleSortObjects(window) {
  await window.getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function openFilterMenu(window) {
  await window.getByTestId("filterObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function checkFilterCategory(window, categoryId) {
  const checkbox = window.getByTestId(`filterCheckbox-${categoryId}`).getByRole("checkbox");
  await checkbox.check();
  await window.waitForTimeout(afterActionWait);
}

async function uncheckFilterCategory(window, categoryId) {
  const checkbox = window.getByTestId(`filterCheckbox-${categoryId}`).getByRole("checkbox");
  await checkbox.uncheck();
  await window.waitForTimeout(afterActionWait);
}

async function toggleSearchObjects(window) {
  await window.getByTestId("searchObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function fillSearchQuery(window, query) {
  const searchInput = window.getByTestId("searchObjectsInput").locator("input");
  await searchInput.fill(query);
  await window.waitForTimeout(afterActionWait);
}

export {
  expandAllObjects,
  collapseAllObjects,
  toggleSortObjects,
  openFilterMenu,
  checkFilterCategory,
  uncheckFilterCategory,
  toggleSearchObjects,
  fillSearchQuery,
};
