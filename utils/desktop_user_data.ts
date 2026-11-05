// Third party imports
import { app } from "electron";
import { consola } from "consola";

// Isolate userData folder for concurrent Playwright workers during E2E tests
if (process.env.CI === "e2e") {
  const workerIndex = process.env.TEST_WORKER_INDEX ?? "0";
  const defaultUserDataPath = app.getPath("userData");
  app.setPath("userData", `${defaultUserDataPath}-e2e-worker-${workerIndex}`);
}
consola.info(`[Electron] userData path: ${app.getPath("userData")}`);

const userDataPath = app.getPath("userData");

export { userDataPath };
