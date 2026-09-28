import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "rolldown";

function collectTsFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(entryPath));
    } else if (entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }
  return files;
}

const packageJson: unknown = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (
  typeof packageJson !== "object" ||
  packageJson === null ||
  !("name" in packageJson) ||
  typeof packageJson.name !== "string"
) {
  throw new Error('package.json is missing a string "name" field');
}
const ownPackageName = packageJson.name;

function isExternal(id: string): boolean {
  if (id.startsWith(".") || path.isAbsolute(id) || id.startsWith("@vease_tests/")) {
    return false;
  }
  if (id === ownPackageName || id.startsWith(`${ownPackageName}/`)) {
    return false;
  }
  return true;
}

// `@vease_tests/*` is a tsconfig path alias understood by Playwright's own TS loader at
// Dev time, but rolldown doesn't read tsconfig paths, so it would otherwise leave
// These specifiers untouched as unresolvable bare imports in the compiled output.
const TESTS_ALIAS_PREFIX = "@vease_tests/";
const TESTS_ALIAS_ROOT = "tests/e2e";

function resolveTestsAlias(source: string): string | undefined {
  const relativePath = source.slice(TESTS_ALIAS_PREFIX.length).replace(/\.(?<ext>js|ts)$/u, "");
  const base = path.resolve(TESTS_ALIAS_ROOT, relativePath);
  for (const candidate of [`${base}.ts`, `${base}.js`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

const testsAliasPlugin = {
  name: "tests-alias",
  resolveId(
    source: string,
    importer: string | undefined,
  ): string | { id: string; external: boolean } | undefined {
    if (source.startsWith(TESTS_ALIAS_PREFIX)) {
      return resolveTestsAlias(source);
    }
    // Rolldown miscalculates the relative path depth when it recomputes an
    // Externalized relative import (like the repo-root package.json read for the
    // App version/name) against the output location: preserveModules mirrors each
    // Input file's path under ".build", one directory level deeper than the
    // Source tree, so a specifier that is correct from the source file resolves
    // One level short from the compiled output file. Recompute it relative to
    // Where the output file will actually live.
    if (source.endsWith(".json") && source.startsWith(".") && importer !== undefined) {
      const projectRoot = process.cwd();
      const targetAbsPath = path.resolve(path.dirname(importer), source);
      const importerAbsPath = path.isAbsolute(importer)
        ? importer
        : path.resolve(projectRoot, importer);
      const outputFileAbsPath = path.resolve(
        projectRoot,
        ".build",
        path.relative(projectRoot, importerAbsPath),
      );
      const relativeSpecifier = path
        .relative(path.dirname(outputFileAbsPath), targetAbsPath)
        .split(path.sep)
        .join("/");
      const id = relativeSpecifier.startsWith(".") ? relativeSpecifier : `./${relativeSpecifier}`;
      return { id, external: true };
    }
    return undefined;
  },
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  input: collectTsFiles("tests/e2e/utils"),
  platform: "node",
  external: isExternal,
  plugins: [testsAliasPlugin],
  output: {
    dir: ".build",
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: ".",
  },
});
