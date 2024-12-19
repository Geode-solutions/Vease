<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="SurfaceTriangles"
    tooltip="Triangles options"
  />
</template>

<script setup>
import SurfaceTriangles from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("SurfaceTrianglesOptions props", props.itemProps);
</script>
