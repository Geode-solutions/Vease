import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

export default defineNuxtPlugin(() => {
  console.log("[PLUGIN] Initializing microservices plugin...");

  const infraStore = useInfraStore();

  // Initialize and register geode microservice
  console.log("[PLUGIN] Registering geode microservice");
  const backStore = useBackStore();
  infraStore.register_microservice(backStore);

  // Initialize and register viewer microservice
  console.log("[PLUGIN] Registering viewer microservice");
  const viewerStore = useViewerStore();
  infraStore.register_microservice(viewerStore);

  console.log(infraStore.microservices);

  console.log("[PLUGIN] All microservices registered and stores initialized");
});
