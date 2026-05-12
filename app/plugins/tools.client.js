import { useUIStore } from "@vease/stores/ui";

export default defineNuxtPlugin(() => {
  const UIStore = useUIStore();

  UIStore.registerToolComponent({
    id: "Point",
    title: "Specific Point",
    description: "Create a point object with exact coordinates on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-circle-medium",
    component: markRaw(
      defineAsyncComponent(() => import("@vease/components/tools/CreatePoint.vue")),
    ),
  });

  UIStore.registerToolComponent({
    id: "Curve",
    title: "Curve",
    description: "Create a curve object by picking points on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-vector-polyline",
    component: markRaw(
      defineAsyncComponent(() => import("@vease/components/tools/CreateCurve.vue")),
    ),
  });
});
