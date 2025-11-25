import { useInfraStore } from "@ogw_front/stores/infra.js"
import { useGeodeStore } from "@ogw_front/stores/geode.js"
import { useViewerStore } from "@ogw_front/stores/viewer.js"

export default defineNuxtPlugin({
  name: "microservices",
  hooks: {
    "app:beforeMount"() {
      const infra_store = useInfraStore()
      infra_store.register_microservice({
        name: "geode",
        useStore: useGeodeStore,
        connect: (store) => store.do_ping(),
        electron_runner: "run_back",
      })
      infra_store.register_microservice({
        name: "viewer",
        useStore: useViewerStore,
        connect: (store) => store.ws_connect(),
        electron_runner: "run_viewer",
      })
    },
  },
})
