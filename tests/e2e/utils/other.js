
async function waitForLoadingScreen(window) {
  const loadingScreen = window.locator('div[style*="z-index: 3"][style*="backdrop-filter: blur"]');
  await loadingScreen.waitFor({ state: "hidden", timeout: 180_000 });
}
export { waitForLoadingScreen };