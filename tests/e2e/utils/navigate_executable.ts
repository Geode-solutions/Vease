// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import { consola } from "consola";

import { executableName } from "@geode/opengeodeweb-front/server/utils/path.js";

// Local imports
// oxlint-disable-next-line no-relative-parent-imports
import packageJson from "../../../package.json" with { type: "json" };

// Constants
const __dirname = import.meta.dirname;

function findAppExecutable(): string {
  const appExecutablePath = process.env.DESKTOP_EXECUTABLE_PATH;
  if (
    appExecutablePath !== undefined &&
    appExecutablePath !== "" &&
    fs.existsSync(appExecutablePath)
  ) {
    consola.debug({ appExecutablePath });
    return path.join(appExecutablePath, executableName(packageJson.name));
  }
  const buildReleasePath = path.join(__dirname, "../../../release", "0.0.0");
  consola.debug([buildReleasePath]);
  const buildPath = findLatestBuild(buildReleasePath);
  return parseElectronApp(buildPath).executable;
}

export { findAppExecutable };
