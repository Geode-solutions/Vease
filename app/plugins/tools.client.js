import AOIicon from "../assets/img/aoi.svg"
import VOIicon from "../assets/img/voi.svg"
import { useUIStore } from "../stores/UI"

export default defineNuxtPlugin((nuxtApp) => {
  const UIStore = useUIStore()

  UIStore.initializeDefaultTools()

  const CreatePointComponent = defineAsyncComponent(
    () => import("../components/tools/CreatePoint"),
  )
  UIStore.registerToolComponent({
    id: "Point",
    title: "Specific Point",
    description: "Create a point object with exact coordinates on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-circle-medium",
    component: markRaw(CreatePointComponent),
  })

  const CreateAOIComponent = defineAsyncComponent(
    () => import("../components/tools/CreateAOI"),
  )
  UIStore.registerToolComponent({
    id: "AOI",
    title: "Area of Interest",
    description: "Define an area of interest on the viewer with 4 points.",
    iconType: "svg",
    iconSource: AOIicon,
    component: markRaw(CreateAOIComponent),
  })

  const CreateVOIComponent = defineAsyncComponent(
    () => import("../components/tools/CreateVOI"),
  )
  UIStore.registerToolComponent({
    id: "VOI",
    title: "Volume of Interest",
    description: "Create a 3D bounding box from an existing AOI with Z bounds.",
    iconType: "svg",
    iconSource: VOIicon,
    component: markRaw(CreateVOIComponent),
  })
})
