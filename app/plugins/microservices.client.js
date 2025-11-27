import { useInfraStore } from "@ogw_front/stores/infra.js"
import {
  useGeodeStore,
  geode_request,
  geode_connect,
} from "@ogw_front/stores/geode.js"
import {
  useViewerStore,
  viewer_request,
  viewer_connect,
} from "@ogw_front/stores/viewer.js"

export default defineNuxtPlugin({
  name: "microservices",
  hooks: {
    "app:beforeMount"() {
      console.log("[MICROSERVICES PLUGIN] Initializing microservices...")
      const infra_store = useInfraStore()

      console.log("[MICROSERVICES PLUGIN] Registering geode microservice")
      infra_store.register_microservice({
        name: "geode",
        useStore: useGeodeStore,
        request: geode_request,
        connect: geode_connect,
        electron_runner: "run_back",
      })

      console.log("[MICROSERVICES PLUGIN] Registering viewer microservice")
      infra_store.register_microservice({
        name: "viewer",
        useStore: useViewerStore,
        request: viewer_request,
        connect: viewer_connect,
        electron_runner: "run_viewer",
      })

      console.log("[MICROSERVICES PLUGIN] All microservices registered")
    },
  },
})
