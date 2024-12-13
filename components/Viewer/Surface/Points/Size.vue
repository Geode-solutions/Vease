<template>
  <ViewerGenericMeshPointsSize
    :itemProps="props.itemProps"
    :btn_image="SurfacePointsSize"
  />
</template>

<script setup>
import SurfacePointsSize from "@/assets/viewer_svgs/surface_points_size.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsSize props", props.itemProps);
</script>
