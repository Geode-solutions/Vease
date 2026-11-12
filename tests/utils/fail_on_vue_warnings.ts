import { afterEach } from "vitest";
import { config } from "@vue/test-utils";

// Every Vue warning (Vuetify deprecations included) fails the test that emitted it, so they can't come back unnoticed
const vueWarnings: string[] = [];

config.global.config = {
  ...config.global.config,
  warnHandler: (message, _instance, trace): void => {
    vueWarnings.push(`[Vue warn]: ${message}\n${trace}`);
  },
};

// Global on purpose (outside any describe block), like setup_global_hooks.ts
// oxlint-disable-next-line vitest/require-top-level-describe
afterEach(() => {
  const warnings = vueWarnings.splice(0);
  if (warnings.length > 0) {
    throw new Error(`Vue warnings were emitted:\n${warnings.join("\n\n")}`);
  }
});
