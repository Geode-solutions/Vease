import { ensureFeatureVisible, ensureMenuOpen } from "@vease_tests/utils/viewer_interaction";
import type { Page } from "@playwright/test";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

interface Texture {
  name: string;
  filePath: string;
}

async function selectOverlayListItem(window: Page, text: string): Promise<void> {
  await window
    .locator(".v-overlay-container")
    .locator(".v-list-item")
    .filter({ hasText: text, visible: true })
    .first()
    .click();
  await waitForActionSettled(window);
}

async function setFeatureTextures(
  window: Page,
  menuTestId: string,
  texture: Texture,
): Promise<void> {
  await ensureMenuOpen(window, menuTestId);
  await ensureFeatureVisible(window, menuTestId);
  const container = window.getByTestId(menuTestId);
  await container.getByTestId("coloringStyleSelector").first().click();
  await waitForActionSettled(window);
  await selectOverlayListItem(window, "Textures");

  await container.getByTestId("textureNameSelector").first().click();
  await waitForActionSettled(window);
  await selectOverlayListItem(window, texture.name);

  const fileInput = container.locator('input[type="file"][accept*="image/png"]').first();
  await fileInput.setInputFiles(texture.filePath);
  await waitForActionSettled(window);
}

export { setFeatureTextures };
