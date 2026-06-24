// Node imports
import path from "node:path";

// Third party imports
import { test as base } from "@playwright/test";

// Local imports

const test = base.extend({
  mode: ["DEFAULT", { option: true }],

  logTestProgress: [
    async ({}, use, testInfo) => {
      const name = `${path.basename(testInfo.file)} › ${testInfo.title}`;
      console.log(`\x1b[33m[START]\x1b[0m ${name}`);
      const start = Date.now();
      await use();
      const statusColor = testInfo.status === "passed" ? "\x1b[32m" : "\x1b[31m";
      const status = (testInfo.status || "done").toUpperCase();
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`\x1b[35m[END]\x1b[0m ${name} : ${statusColor}${status}\x1b[0m (${duration}s)`);
    },
    { auto: true },
  ],
});

export { test };
