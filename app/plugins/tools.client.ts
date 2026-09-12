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

  UIStore.registerToolComponent({
    id: "PolygonalSurface",
    title: "Surface",
    description: "Create a polygonal surface object by picking points on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-vector-polygon",
    component: markRaw(
      defineAsyncComponent(() => import("@vease/components/tools/CreatePolygonalSurface.vue")),
    ),
  });
});
