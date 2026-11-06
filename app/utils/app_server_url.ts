// Local imports
import { useAppStore } from "@ogw_front/stores/app";

// The app server is the page origin on desktop and browser, but the session's Cloud Run instance on cloud
function appServerUrl(route: string): string {
  return `${useAppStore().base_url}${route}`;
}

export { appServerUrl };
