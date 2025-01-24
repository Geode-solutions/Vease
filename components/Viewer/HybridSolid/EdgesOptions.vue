<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidEdges"
  />
</template>

<script setup>
// TO CHANGE
import HybridSolidEdges from "@/assets/viewer_svgs/edged_curve_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
