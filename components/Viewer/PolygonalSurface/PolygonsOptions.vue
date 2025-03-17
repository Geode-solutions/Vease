<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="PolygonalSurfacePolygons"
  />
</template>

<script setup>
import PolygonalSurfacePolygons from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
