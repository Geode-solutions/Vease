import { useBackStore } from "@ogw_front/stores/back";
import { useViewerStore } from "@ogw_front/stores/viewer";

import { setBackBaseUrl, setViewerBaseUrl } from "@ogw_shared/scripts";
import { connectToEventSource } from "@vease/utils/events";

export default defineNuxtPlugin(() => {
  const backStore = useBackStore();
  const viewerStore = useViewerStore();

  backStore.$onAction(({ name, after }) => {
    if (name !== "launch") {
      return;
    }
    after(async () => {
      try {
        await setBackBaseUrl(backStore.base_url);
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
        await setViewerBaseUrl(viewerStore.base_url);
      } catch (error) {
        console.error("[SYNC] viewer launch failed", error);
      }
    });
  });
});
