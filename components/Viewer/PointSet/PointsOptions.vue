<template>
  <ViewerGenericMeshPointsOptions
    :itemProps="props.itemProps"
    :btn_image="PointSetPoints"
  />
</template>

<script setup>
import PointSetPoints from "@/assets/viewer_svgs/point_set_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("PointSetPointsOptions props", props.itemProps);
</script>
