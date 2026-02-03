import { useGeodeStore } from "@ogw_front/stores/geode"
import { useInfraStore } from "@ogw_front/stores/infra"
import { useViewerStore } from "@ogw_front/stores/viewer"

export default defineNuxtPlugin(() => {
  console.log("[PLUGIN] Initializing microservices plugin...")

  const infraStore = useInfraStore()

  // Initialize and register geode microservice
  console.log("[PLUGIN] Registering geode microservice")
  const geodeStore = useGeodeStore()
  infraStore.register_microservice(geodeStore)

  // Initialize and register viewer microservice
  console.log("[PLUGIN] Registering viewer microservice")
  const viewerStore = useViewerStore()
  infraStore.register_microservice(viewerStore)

  console.log(infraStore.microservices)

  console.log("[PLUGIN] All microservices registered and stores initialized")
})
