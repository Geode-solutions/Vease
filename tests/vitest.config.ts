import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import path from "node:path";
import fs from "node:fs";

const __dirname = import.meta.dirname;

const RETRIES = 3;
const DEFAULT_RETRY = 0;
const TIMEOUTS = {
  unit: 15_000,
  integration: 30_000,
};
const HOOK_TIMEOUT = 30_000;
const CI_WORKERS = 4;

const globalRetry = process.env.CI ? RETRIES : DEFAULT_RETRY;
const maxWorkers = process.env.CI ? CI_WORKERS : undefined;

const ogwFrontApp = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "OpenGeodeWeb",
  "OpenGeodeWeb-Front",
  "app",
);
const ogwShared = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "OpenGeodeWeb",
  "OpenGeodeWeb-Front",
  "shared",
);
const ogwInternal = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "OpenGeodeWeb",
  "OpenGeodeWeb-Front",
  "internal",
);
const ogwTests = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "OpenGeodeWeb",
  "OpenGeodeWeb-Front",
  "tests",
);

const aliases = {
  "@vease": path.resolve(__dirname, "..", "app"),
  "@vease_server": path.resolve(__dirname, "..", "server"),
  "@vease_tests": path.resolve(__dirname, "."),
  "@ogw_front": ogwFrontApp,
  "@ogw_shared": ogwShared,
  "@ogw_internal": ogwInternal,
  "@ogw_tests": ogwTests,
};

const resolveOgwAliasPlugin = {
  name: "resolve-ogw-alias",
  enforce: "pre" as const,
  resolveId(id: string) {
    if (id.startsWith("@ogw_front/")) {
      const relativePath = id.replace("@ogw_front/", "");
      const basePath = path.join(ogwFrontApp, relativePath);
      for (const ext of ["", ".ts", ".vue", ".js", "/index.ts"]) {
        const candidate = basePath.endsWith(ext) ? basePath : `${basePath}${ext}`;
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return candidate;
        }
        if (basePath.endsWith(".js") && ext === ".ts") {
          const candidateTs = `${basePath.slice(0, -3)}.ts`;
          if (fs.existsSync(candidateTs) && fs.statSync(candidateTs).isFile()) {
            return candidateTs;
          }
        }
      }
    }
    return null;
  },
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    setupFiles: [path.resolve(__dirname, "./setup_indexeddb.ts")],
    projects: [
      // oxlint-disable-next-line no-top-level-await
      await defineVitestProject({
        plugins: [resolveOgwAliasPlugin],
        resolve: {
          extensions: [".ts", ".js", ".jsx", ".tsx", ".json", ".vue", ".mjs"],
          alias: aliases,
        },
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          globals: true,
          environment: "nuxt",
          alias: aliases,
          testTimeout: TIMEOUTS.unit,
          hookTimeout: HOOK_TIMEOUT,
          setupFiles: [path.resolve(__dirname, "./setup_indexeddb.ts")],
          server: {
            deps: {
              inline: ["vuetify"],
            },
          },
          retry: globalRetry,
        },
      }),
      // oxlint-disable-next-line no-top-level-await
      await defineVitestProject({
        plugins: [resolveOgwAliasPlugin],
        resolve: {
          extensions: [".ts", ".js", ".jsx", ".tsx", ".json", ".vue", ".mjs"],
          alias: aliases,
        },
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          globals: true,
          environment: "nuxt",
          alias: aliases,
          maxWorkers,
          testTimeout: TIMEOUTS.integration,
          hookTimeout: HOOK_TIMEOUT,
          setupFiles: [path.resolve(__dirname, "./setup_indexeddb.ts")],
          server: {
            deps: {
              inline: ["vuetify"],
            },
          },
          retry: globalRetry,
        },
      }),
    ],
  },
});
