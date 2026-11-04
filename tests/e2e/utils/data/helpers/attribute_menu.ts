import type { Locator, Page } from "@playwright/test";

async function resetMenuScroll(window: Page, scrollTop = 0): Promise<void> {
  await window.evaluate((top) => {
    const cardTexts = document.querySelectorAll(".v-card-text");
    for (const cardTextElement of cardTexts) {
      cardTextElement.scrollTop = top;
    }
  }, scrollTop);
}

function getMenuContainer(window: Page, menuTestId: string | Locator): Locator {
  if (typeof menuTestId === "string") {
    return window.getByTestId(menuTestId);
  }
  return menuTestId;
}

export { getMenuContainer, resetMenuScroll };
