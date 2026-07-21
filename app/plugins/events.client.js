import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

import { connectToEventSource } from "@vease/utils/events.js";

export default defineNuxtPlugin(() => {
  console.log("[PLUGIN] Initializing microservices plugin...");

  const infraStore = useInfraStore();

  console.log("[PLUGIN] Registering geode microservice");
  const backStore = useBackStore();
  infraStore.register_microservice(backStore);

  console.log("[PLUGIN] Registering viewer microservice");
  const viewerStore = useViewerStore();
  infraStore.register_microservice(viewerStore);

  console.log(infraStore.microservices);

  const stopWatching = watch(
    () => infraStore.microservices_connected,
    (connected) => {
      if (connected) {
        console.log("[PLUGIN] All microservices connected — starting event source");
        connectToEventSource();
        stopWatching();
      }
    },
    { immediate: true },
  );

  console.log("[PLUGIN] All microservices registered and stores initialized");
});