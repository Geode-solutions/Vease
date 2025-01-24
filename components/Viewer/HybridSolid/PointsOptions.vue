<template>
  <ViewerGenericMeshPointsOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidPoints"
  />
</template>

<script setup>
// TO CHANGE
import HybridSolidPoints from "@/assets/viewer_svgs/edged_curve_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
