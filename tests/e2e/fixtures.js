import { test as base, expect } from "@playwright/test";

const test = base.extend({
  mode: ["DEFAULT", { option: true }],
});

export { expect, test };
