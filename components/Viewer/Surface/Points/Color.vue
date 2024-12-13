<template>
  <ViewerGenericMeshPointsColor
    :itemProps="props.itemProps"
    :btn_image="SurfacePointsColor"
  />
</template>

<script setup>
import SurfacePointsColor from "@/assets/viewer_svgs/surface_points_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsColor props", props.itemProps);
</script>
