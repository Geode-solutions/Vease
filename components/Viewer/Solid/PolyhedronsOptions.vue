<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="Solid2DTriangles"
    tooltip="Triangles options"
  />
</template>

<script setup>
import Solid2DTriangles from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
