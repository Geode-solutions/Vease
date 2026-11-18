// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { consola } from "consola";

const __dirname = import.meta.dirname;
const MILLISECONDS_PER_SECOND = 1000;
const BYTES_PER_MEGABYTE = 1_000_000;

// Files too large for the repository are assets of the "e2e-data" release
const E2E_DATA_RELEASE_URL = "https://github.com/Geode-solutions/Vease/releases/download/e2e-data";
// Git ignored: downloaded once, then reused by the next runs
const REMOTE_DATA_PATH = path.join(__dirname, "..", "tests", "data", "remote");

async function downloadRemoteTestData(filename: string): Promise<string> {
  const filePath = path.join(REMOTE_DATA_PATH, filename);
  if (fs.existsSync(filePath)) {
    return REMOTE_DATA_PATH;
  }
  fs.mkdirSync(REMOTE_DATA_PATH, { recursive: true });
  const url = `${E2E_DATA_RELEASE_URL}/${filename}`;
  consola.info(`Downloading ${url}`);
  const start = Date.now();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  // Written aside then renamed: an interrupted download never looks complete
  const partialPath = `${filePath}.part`;
  fs.writeFileSync(partialPath, Buffer.from(await response.arrayBuffer()));
  fs.renameSync(partialPath, filePath);
  const sizeMegabytes = (fs.statSync(filePath).size / BYTES_PER_MEGABYTE).toFixed(0);
  const seconds = ((Date.now() - start) / MILLISECONDS_PER_SECOND).toFixed(1);
  consola.info(`Downloaded ${filename} (${sizeMegabytes} MB) in ${seconds}s`);
  return REMOTE_DATA_PATH;
}

export { downloadRemoteTestData };
