import { consola } from "consola";
import { getInfraStore } from "@vease/utils/external_stores";
import { useBackStore } from "@ogw_front/stores/back";
import { useViewerStore } from "@ogw_front/stores/viewer";

export default defineNuxtPlugin(() => {
  consola.info("[PLUGIN] Initializing microservices plugin...");

  const infraStore = getInfraStore();

  // Initialize and register geode microservice
  consola.info("[PLUGIN] Registering geode microservice");
  const backStore = useBackStore();
  infraStore.register_microservice(backStore);

  // Initialize and register viewer microservice
  consola.info("[PLUGIN] Registering viewer microservice");
  const viewerStore = useViewerStore();
  infraStore.register_microservice(viewerStore);

  consola.info("[PLUGIN] All microservices registered and stores initialized");
});
