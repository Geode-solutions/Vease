/**
 * Starts a cloud Vease instance, opens it in the browser and loads a local
 * data file into it through the Vease controller.
 * Usage: npm run cloud:load -- <path/to/file>
 * Credentials: GEODE_USER_EMAIL and GEODE_USER_PASSWORD environment variables.
 */

import { openAsBlob, statSync } from "node:fs";
import { consola } from "consola";
import { parseArgs } from "node:util";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { spawn } from "node:child_process";

/**
 * @typedef {{ filePath: string, email: string, password: string }} CliOptions
 * @typedef {{ id: string, name: string, geodeObjectType: string }} LoadedData
 */

const CLOUD_API_URL = "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api";
const FRONT_URL = "https://vease.geode-solutions.com";
const PROJECT = "vease";
const BRANCH = "master";
/** @type {Map<string, string>} */
const BROWSER_OPENERS = new Map([
  ["darwin", "open"],
  ["win32", "explorer"],
]);
const DEFAULT_BROWSER_OPENER = "xdg-open";
const USAGE = "Usage: npm run cloud:load -- <path/to/file>";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_MINUTE = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
const RUN_TIMEOUT_MINUTES = 5;
const READY_TIMEOUT_MINUTES = 2;
const READY_POLL_INTERVAL_MS = MILLISECONDS_IN_SECOND;

/**
 * @param {unknown} error
 * @returns {string}
 */
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isFile(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * @param {string[]} argv
 * @returns {CliOptions}
 */
function parseCli(argv) {
  const { positionals } = parseArgs({ args: argv, allowPositionals: true });
  if (positionals.length !== 1) {
    throw new Error(USAGE);
  }
  const [filePath] = positionals;
  if (!isFile(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const { GEODE_USER_EMAIL: email, GEODE_USER_PASSWORD: password } = process.env;
  if (email === undefined || email === "" || password === undefined || password === "") {
    throw new Error("Set the GEODE_USER_EMAIL and GEODE_USER_PASSWORD environment variables");
  }
  return { filePath, email, password };
}

/**
 * Fetches a JSON response, turning network errors and non-2xx statuses into
 * errors that name the workflow step.
 * @param {string} step
 * @param {string} url
 * @param {RequestInit} [init]
 * @returns {Promise<unknown>}
 */
async function requestJson(step, url, init) {
  /** @type {Response} */
  let response = undefined;
  try {
    response = await fetch(url, init);
  } catch (error) {
    const reason =
      error instanceof Error && error.cause instanceof Error
        ? error.cause.message
        : errorMessage(error);
    throw new Error(`${step}: request to ${url} failed (${reason})`, { cause: error });
  }
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${step}: HTTP ${response.status} ${body}`);
  }
  return JSON.parse(body);
}

/**
 * Reads a field of a JSON response, failing with the step name when it is missing.
 * @param {string} step
 * @param {unknown} json
 * @param {string} key
 * @returns {unknown}
 */
function readField(step, json, key) {
  /** @type {Map<string, unknown>} */
  const fields = new Map(typeof json === "object" && json !== null ? Object.entries(json) : []);
  const value = fields.get(key);
  if (value === undefined) {
    throw new Error(`${step}: no "${key}" in response ${JSON.stringify(json)}`);
  }
  return value;
}

/**
 * @param {string} step
 * @param {unknown} json
 * @param {string} key
 * @returns {string}
 */
function readString(step, json, key) {
  const value = readField(step, json, key);
  if (typeof value !== "string") {
    throw new TypeError(`${step}: "${key}" is not a string in response ${JSON.stringify(json)}`);
  }
  return value;
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>}
 */
async function login(email, password) {
  const step = "Login";
  const json = await requestJson(step, `${CLOUD_API_URL}/cloud_api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return readString(step, json, "idToken");
}

/**
 * Blocks until Cloud Run reports the instance ready.
 * @param {string} idToken
 * @returns {Promise<string>} The instance's bare host.
 */
async function runInstance(idToken) {
  const step = "Run";
  const json = await requestJson(step, `${CLOUD_API_URL}/cloud_api/cloud/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ project: PROJECT, branch: BRANCH }),
    signal: AbortSignal.timeout(RUN_TIMEOUT_MINUTES * MILLISECONDS_IN_MINUTE),
  });
  return readString(step, json, "url");
}

/**
 * @param {string} url
 */
function openBrowser(url) {
  const opener = BROWSER_OPENERS.get(process.platform) ?? DEFAULT_BROWSER_OPENER;
  const child = spawn(opener, [url], { detached: true, stdio: "ignore" });
  child.on("error", () => {
    consola.warn(`Could not open the browser, open ${url} manually`);
  });
  child.unref();
}

/**
 * @param {string} appUrl
 * @returns {Promise<boolean>}
 */
async function isAppReady(appUrl) {
  const step = "Wait for app ready";
  try {
    const json = await requestJson(step, `${appUrl}/api/microservice/app/get_is_app_ready`);
    return readField(step, json, "isReady") === true;
  } catch (error) {
    consola.debug(errorMessage(error));
    return false;
  }
}

/**
 * The browser marks the app ready once its back and viewer are connected.
 * @param {string} appUrl
 * @param {number} deadline
 * @returns {Promise<void>}
 */
async function waitForAppReady(appUrl, deadline) {
  if (await isAppReady(appUrl)) {
    return;
  }
  if (Date.now() > deadline) {
    throw new Error(`Wait for app ready: timed out after ${READY_TIMEOUT_MINUTES} min`);
  }
  await sleep(READY_POLL_INTERVAL_MS);
  await waitForAppReady(appUrl, deadline);
}

/**
 * @param {string} appUrl
 * @param {string} filePath
 * @returns {Promise<LoadedData>}
 */
async function loadData(appUrl, filePath) {
  const step = "Load data";
  const form = new FormData();
  form.append("file", await openAsBlob(filePath), path.basename(filePath));
  const json = await requestJson(step, `${appUrl}/api/controller/data/load`, {
    method: "POST",
    body: form,
  });
  const data = readField(step, json, "response");
  return {
    id: readString(step, data, "id"),
    name: readString(step, data, "name"),
    geodeObjectType: readString(step, data, "geode_object_type"),
  };
}

async function main() {
  const { filePath, email, password } = parseCli(process.argv.slice(2));

  consola.start("Logging in");
  const idToken = await login(email, password);

  consola.start("Starting a cloud instance (this can take a few minutes)");
  const host = await runInstance(idToken);
  consola.success(`Instance ready: ${host}`);

  const frontUrl = `${FRONT_URL}/?cloud_url=${host}`;
  consola.info(`Opening ${frontUrl}`);
  openBrowser(frontUrl);

  consola.start("Waiting for the browser to connect");
  const appUrl = `https://${host}/server`;
  await waitForAppReady(appUrl, Date.now() + READY_TIMEOUT_MINUTES * MILLISECONDS_IN_MINUTE);

  consola.start(`Loading ${filePath}`);
  const data = await loadData(appUrl, filePath);
  consola.success(`Loaded ${data.name} (id: ${data.id}, type: ${data.geodeObjectType})`);

  consola.box(`Vease is running on ${host}\nClose the browser tab to let the instance shut down.`);
}

try {
  // oxlint-disable-next-line node/no-top-level-await -- CLI entry point, never loaded with require()
  await main();
} catch (error) {
  consola.error(errorMessage(error));
  process.exitCode = 1;
}
