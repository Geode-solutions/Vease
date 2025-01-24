<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidPolyhedrons"
  />
</template>

<script setup>
// TO CHANGE
import HybridSolidPolyhedrons from "@/assets/viewer_svgs/edged_curve_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
