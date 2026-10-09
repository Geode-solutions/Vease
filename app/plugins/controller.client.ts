import { useViewerStore } from "@ogw_front/stores/viewer";

import { connectControllerClient } from "@vease/utils/controller/index";
import { getBackStore } from "@vease/utils/external_stores";

export default defineNuxtPlugin(() => {
  const backStore = getBackStore();
  const viewerStore = useViewerStore();

  let backLaunched = false;
  let viewerLaunched = false;
  let connected = false;

  function connectWhenReady(): void {
    if (backLaunched && viewerLaunched && !connected) {
      connected = true;
      connectControllerClient();
    }
  }

  backStore.$onAction(({ name, after }) => {
    if (name !== "launch") {
      return;
    }
    after(() => {
      backLaunched = true;
      connectWhenReady();
    });
  });

  viewerStore.$onAction(({ name, after }) => {
    if (name !== "launch") {
      return;
    }
    after(() => {
      viewerLaunched = true;
      connectWhenReady();
    });
  });
});
