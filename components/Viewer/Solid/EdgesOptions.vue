<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="SurfaceEdges"
  />
</template>

<script setup>
// TO CHANGE
import SurfaceEdges from "@/assets/viewer_svgs/surface_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
