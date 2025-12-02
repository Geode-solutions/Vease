export default defineNuxtPlugin(() => {
  const UIStore = useUIStore()

  UIStore.registerToolComponent({
    id: "Point",
    title: "Specific Point",
    description: "Create a point object with exact coordinates on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-circle-medium",
    component: markRaw(
      defineAsyncComponent(() => import("../components/tools/CreatePoint.vue")),
    ),
  })
})
