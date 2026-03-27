import { test as base } from "@playwright/test";

export const test = base.extend({
  mode: ["DEFAULT", { option: true }],
});

export { expect } from "@playwright/test";
