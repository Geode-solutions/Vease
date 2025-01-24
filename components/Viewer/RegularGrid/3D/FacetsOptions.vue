<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="Grid3DFacets"
    tooltip="Facets options"
  />
</template>

<script setup>
// TO CHANGE
import Grid3DFacets from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
