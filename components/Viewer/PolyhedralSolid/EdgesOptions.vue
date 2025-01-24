<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="PolyhedralSolidEdges"
  />
</template>

<script setup>
// TO CHANGE
import PolyhedralSolidEdges from "@/assets/viewer_svgs/edged_curve_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
