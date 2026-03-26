import { test as base } from "@playwright/test";

export const test = base.extend({
  mode: ["BROWSER", { option: true }],
});

export { expect } from "@playwright/test";
