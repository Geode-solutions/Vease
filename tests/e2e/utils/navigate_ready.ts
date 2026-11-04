// Node imports
import { setTimeout } from "node:timers/promises";

// Third party imports
import { consola } from "consola";

import { getIsAppReady } from "@geode/opengeodeweb-front/shared/scripts.js";

// Local imports
import { MILLISECONDS } from "./navigate_config";

interface AppReadyResponse {
  isReady?: boolean;
}

function isAppReadyResponse(value: unknown): value is AppReadyResponse {
  return typeof value === "object" && value !== null;
}

async function waitForAppReady(url: string, timeoutMs: number): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    // oxlint-disable-next-line no-await-in-loop
    const response = await getIsAppReady(url);
    consola.info(`App ready check response: ${JSON.stringify(response)}`);
    if (isAppReadyResponse(response) && response.isReady === true) {
      return true;
    }
    // oxlint-disable-next-line no-await-in-loop
    await setTimeout(MILLISECONDS);
  }
  consola.info("Timed out waiting for app to become ready");
  return false;
}

export { waitForAppReady };
