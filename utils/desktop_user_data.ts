// Third party imports
import { app } from "electron";
import { consola } from "consola";

consola.info(`[Electron] userData path: ${app.getPath("userData")}`);

const userDataPath = app.getPath("userData");

export { userDataPath };
