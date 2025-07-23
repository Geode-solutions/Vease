<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="PolygonalSurfaceEdges"
  />
</template>

<script setup>
import PolygonalSurfaceEdges from "@vease/assets/viewer_svgs/surface_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
