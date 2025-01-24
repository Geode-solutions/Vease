<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="Grid2DCells"
    tooltip="Cells options"
  />
</template>

<script setup>
// TO CHANGE
import Grid2DCells from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
