import { useInfraStore } from "@ogw_front/stores/infra";

import { connectToEventSource } from "@vease/utils/events.js";

export default defineNuxtPlugin(() => {
  console.log("[PLUGIN] Initializing microservices plugin...");
  const infraStore = useInfraStore();
  console.log(infraStore.microservices);

  watch(
    () => infraStore.microservices_connected,
    (connected) => {
      if (connected) {
        console.log("[PLUGIN] All microservices connected — starting event source");
        connectToEventSource();
      }
    },
    { immediate: true, once: true },
  );

  console.log("[PLUGIN] All microservices registered and stores initialized");
});