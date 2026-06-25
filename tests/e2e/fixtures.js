// Node imports
import path from "node:path";

// Third party imports
import { test as base } from "@playwright/test";

// Local imports

const MILLISECONDS_PER_SECOND = 1000;

const test = base.extend({
  mode: ["DEFAULT", { option: true }],

  logTestProgress: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      const name = `${path.basename(testInfo.file)} › ${testInfo.title}`;
      console.log(`\u001B[33m[START]\u001B[0m ${name}`);
      const start = Date.now();
      await use();
      const statusColor = testInfo.status === "passed" ? "\u001B[32m" : "\u001B[31m";
      const status = (testInfo.status || "done").toUpperCase();
      const duration = ((Date.now() - start) / MILLISECONDS_PER_SECOND).toFixed(2);
      console.log(
        `\u001B[35m[END]\u001B[0m ${name} : ${statusColor}${status}\u001B[0m (${duration}s)`,
      );
    },
    { auto: true },
  ],
});

export { test };
