<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidEdges"
  />
</template>

<script setup>
import HybridSolidEdges from "@vease/assets/viewer_svgs/solid_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
