import { useBackStore } from "@ogw_front/stores/back";
import { useViewerStore } from "@ogw_front/stores/viewer";

import { connectToEventSource } from "@vease/utils/events";
import { setBackBaseUrl, setViewerBaseUrl } from "@vease/utils/api";

export default defineNuxtPlugin(() => {
  const backStore = useBackStore();
  const viewerStore = useViewerStore();

  backStore.$onAction(({ name, after, onError }) => {
    if (name !== "launch") return;
    after(async () => {
      console.log("[SYNC] back launch resolved, pushing base_url:", backStore.base_url);
      await setBackBaseUrl(backStore.base_url);
      connectToEventSource();
    });
    onError((error) => console.error("[SYNC] back launch failed", error));
  });

  viewerStore.$onAction(({ name, after, onError }) => {
    if (name !== "launch") return;
    after(async () => {
      console.log("[SYNC] viewer launch resolved, pushing base_url:", viewerStore.base_url);
      await setViewerBaseUrl(viewerStore.base_url);
    });
    onError((error) => console.error("[SYNC] viewer launch failed", error));
  });
});