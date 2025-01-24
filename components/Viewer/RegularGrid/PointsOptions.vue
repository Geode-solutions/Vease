<template>
  <ViewerGenericMeshPointsOptions
    :itemProps="props.itemProps"
    :btn_image="RegularGridPoints"
  />
</template>

<script setup>
// TO CHANGE
import RegularGridPoints from "@/assets/viewer_svgs/surface_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
