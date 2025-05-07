<template>
  <ViewerGenericMeshPointsOptions
    :itemProps="props.itemProps"
    :btn_image="PointSetPoints"
  />
</template>

<script setup>
import PointSetPoints from "@vease/assets/viewer_svgs/point_set_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
