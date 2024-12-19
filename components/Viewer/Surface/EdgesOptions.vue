<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="SurfaceEdges"
  />
</template>

<script setup>
import SurfaceEdges from "@/assets/viewer_svgs/surface_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("SurfaceEdgesOptions props", props.itemProps);
</script>
