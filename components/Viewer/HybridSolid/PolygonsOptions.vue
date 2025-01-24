<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidPolygons"
  />
</template>

<script setup>
// TO CHANGE
import HybridSolidPolygons from "@/assets/viewer_svgs/edged_curve_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
