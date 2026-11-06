import type { Component } from "vue";
import { useUIStore } from "@vease/stores/ui";

function asyncTool(load: () => Promise<Component>): Component {
  return markRaw(defineAsyncComponent(load));
}

const TOOLS = [
  {
    id: "Point",
    title: "Points",
    description: "Create one or more points with exact coordinates from the viewer.",
    iconType: "mdi",
    iconSource: "mdi-circle-medium",
    component: asyncTool(async () => {
      const component = await import("@vease/components/tools/CreatePoint.vue");
      return component;
    }),
  },
  {
    id: "Curve",
    title: "Curve",
    description: "Create a curve object by picking points on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-vector-polyline",
    component: asyncTool(async () => {
      const component = await import("@vease/components/tools/CreateCurve.vue");
      return component;
    }),
  },
  {
    id: "PolygonalSurface",
    title: "Surface",
    description: "Create a polygonal surface object by picking points on the viewer.",
    iconType: "mdi",
    iconSource: "mdi-vector-polygon",
    component: asyncTool(async () => {
      const component = await import("@vease/components/tools/CreatePolygonalSurface.vue");
      return component;
    }),
  },
  {
    id: "HorizonStack",
    title: "Horizon Stack",
    description: "Create a stratigraphic column from horizon and unit names.",
    iconType: "mdi",
    iconSource: "mdi-layers-triple",
    component: asyncTool(async () => {
      const component = await import("@vease/components/tools/CreateHorizonStack.vue");
      return component;
    }),
  },
];

export default defineNuxtPlugin(() => {
  const UIStore = useUIStore();
  for (const tool of TOOLS) {
    UIStore.registerToolComponent(tool);
  }
});
