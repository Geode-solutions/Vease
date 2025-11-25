import { registerMicroservice } from "@ogw_front/stores/infra.js"
import { useGeodeStore } from "@ogw_front/stores/geode.js"
import { useViewerStore } from "@ogw_front/stores/viewer.js"

export default defineNuxtPlugin({
  name: "microservices",
  hooks: {
    "app:beforeMount"() {
      registerMicroservice({
        name: "geode",
        useStore: useGeodeStore,
        connect: (store) => store.do_ping(),
        electron_runner: "run_back",
      })

      registerMicroservice({
        name: "viewer",
        useStore: useViewerStore,
        connect: (store) => store.ws_connect(),
        electron_runner: "run_viewer",
      })
    },
  },
})
