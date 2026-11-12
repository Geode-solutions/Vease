// Third party imports
import type { Page } from "@playwright/test";

// Vue warnings (Vuetify's go through them) and Nuxt diagnostics: browser and WebGL noise is not matched
const FRAMEWORK_WARNING = /^\[Vue warn\]|\[NUXT_E\d+\]/u;

// One app per worker process: the warnings are collected here, and each test takes the ones emitted during it
const frameworkWarnings: string[] = [];

function watchFrameworkWarnings(page: Page): void {
  page.on("console", (message) => {
    const text = message.text();
    if (FRAMEWORK_WARNING.test(text)) {
      frameworkWarnings.push(text);
    }
  });
}

function takeFrameworkWarnings(): string[] {
  return frameworkWarnings.splice(0);
}

export { takeFrameworkWarnings, watchFrameworkWarnings };
