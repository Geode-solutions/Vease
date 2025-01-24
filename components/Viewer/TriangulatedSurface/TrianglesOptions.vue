<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="TriangulatedSurfaceEdgesTriangles"
    tooltip="Triangles options"
  />
</template>

<script setup>
// TO CHANGE
import TriangulatedSurfaceEdgesTriangles from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
