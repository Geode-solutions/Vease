import { useUIStore } from "@vease/stores/ui";

export default defineNuxtPlugin(() => {
  const UIStore = useUIStore();

  UIStore.registerToolComponent({
    id: "Point",
    title: "Points",
    description: "Create one or more points with exact coordinates from the viewer.",
    iconType: "mdi",
    iconSource: "mdi-circle-medium",
    component: markRaw(
      defineAsyncComponent(() => import("@vease/components/tools/CreatePoint.vue")),
    ),
  });
});
