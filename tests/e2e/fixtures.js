import { test as base } from "@playwright/test";

const test = base.extend({
  mode: ["DEFAULT", { option: true }],
});

export { test };
