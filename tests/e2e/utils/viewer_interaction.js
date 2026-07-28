// Constants
const beforeAllTimeout = 60_000;
const afterActionWait = 2000;
const WAIT_FOR_OPTIONS_TIMEOUT = 500;

async function viewerContextMenu(window, x, y) {
  await window.getByTestId("hybridViewer").locator("canvas").click({
    button: "right",
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
}

async function findOverlappingObjectsPicker(window) {
  let found = false;
  const points = [
    { x: 440, y: 530 },
    { x: 600, y: 400 },
    { x: 600, y: 500 },
    { x: 600, y: 300 },
    { x: 500, y: 400 },
    { x: 700, y: 400 },
    { x: 550, y: 450 },
    { x: 650, y: 350 },
    { x: 650, y: 450 },
    { x: 550, y: 350 },
    { x: 400, y: 400 },
    { x: 800, y: 400 },
    { x: 450, y: 550 },
    { x: 500, y: 500 },
  ];

  for (const { x, y } of points) {
    // oxlint-disable-next-line no-await-in-loop
    await window.getByTestId("hybridViewer").locator("canvas").click({
      button: "right",
      position: { x, y },
      delay: 100,
    });
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(afterActionWait);

    // oxlint-disable-next-line no-await-in-loop
    const items = await window.locator(".intermediate-picker-item").count();
    if (items >= 2) {
      found = true;
      break;
    }
    // oxlint-disable-next-line no-await-in-loop
    await window.keyboard.press("Escape");
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(WAIT_FOR_OPTIONS_TIMEOUT);
  }

  if (!found) {
    throw new Error(
      "Could not find overlapping objects picker anywhere! The test data might not be loaded or the picker is broken.",
    );
  }
}

async function ensureMenuOpen(window, menuTestId) {
  const menuContainer = window.getByTestId(menuTestId);
  const menuButton = menuContainer.locator("button.menu-btn");
  if (!(await menuButton.evaluate((node) => node.classList.contains("v-btn--active")))) {
    const activeMenuButton = window.locator(".menu-btn.v-btn--active");
    if (await activeMenuButton.isVisible()) {
      await activeMenuButton.click();
      await window.waitForTimeout(afterActionWait);
    }
    await menuButton.click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function ensureFeatureVisible(window, menuTestId) {
  const switchTestId = menuTestId.replace("Menu", "VisibilitySwitch");
  const visibilitySwitch = await window.getByTestId(switchTestId).getByRole("checkbox");
  if (!(await visibilitySwitch.isChecked())) {
    await visibilitySwitch.check({ force: true });
    // Wait for conditionally rendered options to appear
    await window.waitForTimeout(WAIT_FOR_OPTIONS_TIMEOUT);
  }
}

async function dragElement(window, locator, { targetX, targetY, deltaX = 0, deltaY = 0 } = {}) {
  const { x, y, width, height } = await locator.boundingBox();
  const startX = x + width / 2;
  const startY = y + height / 2;
  await window.mouse.move(startX, startY);
  await window.mouse.down();
  await window.mouse.move(targetX ?? startX + deltaX, targetY ?? startY + deltaY, { steps: 20 });
  await window.mouse.up();
  await window.waitForTimeout(afterActionWait);
}

async function dragContextMenu(window, { targetX, targetY } = {}) {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await dragElement(window, centerButton, { targetX, targetY });
}

function setPolygonsTextures(window, viewerObjectType) {
  return setFeatureTextures(window, viewerObjectType, "Polygons");
}
async function setFeatureTextures(window, viewerObjectType, feature) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const container = window.getByTestId(menuTestId);
  const selector = container.getByTestId("coloringStyleSelector").first();
  await selector.click();
  await window.waitForTimeout(afterActionWait);

  const listItem = window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: "Textures", visible: true })
    .first();
  await listItem.click();
  await window.waitForTimeout(afterActionWait);
}

async function hoverViewerCenter(window) {
  const canvas = window.getByTestId("hybridViewer").locator("canvas");
  const box = await canvas.boundingBox();
  await canvas.hover({
    position: { x: box.width / 2, y: box.height / 2 },
  });
  await window.waitForTimeout(afterActionWait);
}

async function stabilizeHoverTooltip(window) {
  await window.addStyleTag({
    content: ".tooltip-value-dim { visibility: hidden !important; }",
  });
}

function setFeatureVisibility(window, viewerObjectType, feature, visibility) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  const switchTestId = `${viewerObjectType}${feature}VisibilitySwitch`;
  return setVisibilityGeneric(window, menuTestId, switchTestId, visibility);
}

async function setVisibilityGeneric(window, menuTestId, switchTestId, visibility) {
  await ensureMenuOpen(window, menuTestId);
  const checkbox = window.getByTestId(switchTestId).getByRole("checkbox");
  if (visibility) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
  await window.waitForTimeout(afterActionWait);
}

async function setFeatureSizeOrWidth(window, viewerObjectType, feature, value) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  let sliderTestId = `${viewerObjectType}${feature}SizeSlider`;
  if (feature === "Edges") {
    sliderTestId = `${viewerObjectType}${feature}WidthSlider`;
  }
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);

  const slider = await window.getByTestId(sliderTestId);
  await slider
    .locator("input")
    .first()
    .evaluate((node, val) => {
      node.value = val;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }, value.toString());
  await window.waitForTimeout(afterActionWait);
}

// Specific feature functions
function setPointsVisibility(window, viewerObjectType, visibility) {
  if (viewerObjectType === "model") {
    return setVisibilityGeneric(
      window,
      "modelPointsMenu",
      "modelPointsVisibilitySwitch",
      visibility,
    );
  }
  return setFeatureVisibility(window, viewerObjectType, "Points", visibility);
}
function setEdgesVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Edges", visibility);
}
function setPolygonsVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Polygons", visibility);
}
function setPolyhedraVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Polyhedra", visibility);
}
function setCellsVisibility(window, viewerObjectType, visibility) {
  return setFeatureVisibility(window, viewerObjectType, "Cells", visibility);
}

function setPointsSize(window, viewerObjectType, value) {
  return setFeatureSizeOrWidth(window, viewerObjectType, "Points", value);
}
function setEdgesWidth(window, viewerObjectType, value) {
  return setFeatureSizeOrWidth(window, viewerObjectType, "Edges", value);
}

async function toggleInfoCard(window) {
  const centerButton = window.getByTestId("circularMenuCenterButton");
  await centerButton.click();
  await window.waitForTimeout(afterActionWait);
}

export {
  afterActionWait,
  beforeAllTimeout,
  dragContextMenu,
  dragElement,
  ensureFeatureVisible,
  ensureMenuOpen,
  findOverlappingObjectsPicker,
  hoverViewerCenter,
  setCellsVisibility,
  setEdgesVisibility,
  setEdgesWidth,
  setPointsSize,
  setPointsVisibility,
  setPolygonsTextures,
  setPolygonsVisibility,
  setPolyhedraVisibility,
  stabilizeHoverTooltip,
  toggleInfoCard,
  viewerContextMenu,
};
