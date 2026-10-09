import { consola } from "consola";
import { useAppStore } from "@ogw_front/stores/app";

import { connectToEventSource } from "@vease/utils/events/index";
import { getBackStore } from "@vease/utils/external_stores";
import { setBackBaseUrl } from "@ogw_shared/scripts";

export default defineNuxtPlugin(() => {
  const appStore = useAppStore();
  const backStore = getBackStore();

  backStore.$onAction(({ name, after }) => {
    if (name !== "launch") {
      return;
    }
    after(() => {
      void (async (): Promise<void> => {
        try {
          await setBackBaseUrl(appStore.base_url, backStore.base_url);
          connectToEventSource();
        } catch (error) {
          consola.error("[SYNC] back launch failed", error);
        }
      })();
    });
  });
});
