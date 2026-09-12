import { useAppStore } from "@ogw_front/stores/app";
import { useViewerStore } from "@ogw_front/stores/viewer";

import { connectToEventSource, connectToWebSocket } from "@vease/utils/events/index";
import { setBackBaseUrl, setViewerBaseUrl } from "@ogw_shared/scripts";
import { getBackStore } from "@vease/utils/external_stores";

export default defineNuxtPlugin(() => {
  const appStore = useAppStore();
  const backStore = getBackStore();
  const viewerStore = useViewerStore();

  backStore.$onAction(({ name, after }) => {
    if (name !== "launch") {
      return;
    }
    after(async () => {
      try {
        await setBackBaseUrl(appStore.base_url, backStore.base_url);
        connectToEventSource();
      } catch (error) {
        console.error("[SYNC] back launch failed", error);
      }
    });
  });

  viewerStore.$onAction(({ name, after }) => {
    if (name !== "launch") {
      return;
    }
    after(async () => {
      try {
        await setViewerBaseUrl(appStore.base_url, viewerStore.base_url);
        connectToWebSocket();
      } catch (error) {
        console.error("[SYNC] viewer launch failed", error);
      }
    });
  });
});
