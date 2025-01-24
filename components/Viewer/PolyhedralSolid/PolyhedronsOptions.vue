<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="PolyhedralSolidPolyhedrons"
  />
</template>

<script setup>
// TO CHANGE
import PolyhedralSolidPolyhedrons from "@/assets/viewer_svgs/edged_curve_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
