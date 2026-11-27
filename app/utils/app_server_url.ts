// Local imports
import type { Route } from "@ogw_front/types/server";
import type { Url } from "@ogw_front/types/files";
import { useAppStore } from "@ogw_front/stores/app";

// The app server is the page origin on desktop and browser, but the session's Cloud Run instance on cloud
function appServerUrl(route: Route): Url {
  return `${useAppStore().base_url}${route}`;
}

export { appServerUrl };
