<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="PolyhedralSolidPolygons"
  />
</template>

<script setup>
// TO CHANGE
import PolyhedralSolidPolygons from "@/assets/viewer_svgs/edged_curve_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
