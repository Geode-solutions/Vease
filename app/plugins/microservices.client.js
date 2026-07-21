import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

import { connectToEventSource } from "../../shared/index.js";

export default defineNuxtPlugin(async () => {
  console.log("[PLUGIN] Initializing microservices plugin...");

  const infraStore = useInfraStore();

  // Initialize and register geode microservice
  console.log("[PLUGIN] Registering geode microservice");
  const backStore = useBackStore();
  infraStore.register_microservice(backStore);

  // Initialize and register viewer microservice
  console.log("[PLUGIN] Registering viewer microservice");
  const viewerStore = useViewerStore();

  await Promise.all([
    infraStore.register_microservice(backStore),
    infraStore.register_microservice(viewerStore)
  ]);
  console.log(infraStore.microservices);
  await connectToEventSource();

  console.log("[PLUGIN] All microservices registered and stores initialized");
});
