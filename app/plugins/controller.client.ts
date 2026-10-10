import { useViewerStore } from "@ogw_front/stores/viewer";

import { connectControllerClient } from "@vease/utils/controller/index";
import { getBackStore } from "@vease/utils/external_stores";

export default defineNuxtPlugin(() => {
  const backStore = getBackStore();
  const viewerStore = useViewerStore();

  let backConnected = false;
  let viewerConnected = false;
  let clientStarted = false;

  function connectWhenReady(): void {
    if (backConnected && viewerConnected && !clientStarted) {
      clientStarted = true;
      connectControllerClient();
    }
  }

  backStore.$onAction(({ name, after }) => {
    if (name !== "connect") {
      return;
    }
    after(() => {
      backConnected = true;
      connectWhenReady();
    });
  });

  viewerStore.$onAction(({ name, after }) => {
    if (name !== "connect") {
      return;
    }
    after(() => {
      viewerConnected = true;
      connectWhenReady();
    });
  });
});
