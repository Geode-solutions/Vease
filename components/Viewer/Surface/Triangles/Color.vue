<template>
  <ViewerGenericMeshPointsColor
    :itemProps="props.itemProps"
    :btn_image="SurfaceTrianglesColor"
  />
</template>

<script setup>
import SurfaceTrianglesColor from "@/assets/viewer_svgs/surface_triangles_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfaceTrianglesColor props", props.itemProps);
</script>
