<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="Grid3DCells"
    tooltip="Cells options"
  />
</template>

<script setup>
// TO CHANGE
import Grid3DCells from "@/assets/viewer_svgs/surface_triangles.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
