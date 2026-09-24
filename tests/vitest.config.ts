import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;
const require = createRequire(import.meta.url);

const RETRIES = 3;
const DEFAULT_RETRY = 0;
const TIMEOUTS = {
  unit: 10_000,
  integration: 30_000,
};
const HOOK_TIMEOUT = 30_000;
const CI_WORKERS = 4;
const EXTENSION_LENGTH_JS = 3;

const globalRetry = process.env.CI ? RETRIES : DEFAULT_RETRY;
const maxWorkers = process.env.CI ? CI_WORKERS : undefined;

const ogwFrontRoot = path.dirname(require.resolve("@geode/opengeodeweb-front/package.json"));
const ogwFrontApp = path.resolve(ogwFrontRoot, "app");
const ogwShared = path.resolve(ogwFrontRoot, "shared");
const ogwInternal = path.resolve(ogwFrontRoot, "internal");
const ogwTests = path.resolve(ogwFrontRoot, "tests");

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
          const candidateTs = `${basePath.slice(0, -EXTENSION_LENGTH_JS)}.ts`;
          if (fs.existsSync(candidateTs) && fs.statSync(candidateTs).isFile()) {
            return candidateTs;
          }
        }
      }
    }
    return undefined;
  },
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig(async () => ({
  test: {
    setupFiles: [
      path.resolve(__dirname, "./setup_indexeddb.ts"),
      path.resolve(__dirname, "./setup_global_hooks.ts"),
    ],
    projects: [
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
          setupFiles: [
            path.resolve(__dirname, "./setup_indexeddb.ts"),
            path.resolve(__dirname, "./setup_global_hooks.ts"),
          ],
          server: {
            deps: {
              inline: ["vuetify"],
            },
          },
          retry: globalRetry,
        },
      }),
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
          setupFiles: [
            path.resolve(__dirname, "./setup_indexeddb.ts"),
            path.resolve(__dirname, "./setup_global_hooks.ts"),
          ],
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
}));
