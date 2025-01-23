<template>
  <ViewerGenericMeshPointsOptions
    :itemProps="props.itemProps"
    :btn_image="SurfacePoints"
  />
</template>

<script setup>
// TO CHANGE
import SurfacePoints from "@/assets/viewer_svgs/surface_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
