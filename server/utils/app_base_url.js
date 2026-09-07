// Third party imports
import { getAppBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.js";

const DEFAULT_APP_PORT = 3000;

function getResolvedAppBaseUrl() {
  return getAppBaseUrl() ?? `http://localhost:${process.env.PORT ?? DEFAULT_APP_PORT}`;
}

export { getResolvedAppBaseUrl };
