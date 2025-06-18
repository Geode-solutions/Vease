<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="SolidEdges"
  />
</template>

<script setup>
import SolidEdges from "@vease/assets/viewer_svgs/solid_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
