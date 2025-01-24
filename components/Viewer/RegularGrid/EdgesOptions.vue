<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="RegularGridEdges"
  />
</template>

<script setup>
// TO CHANGE
import RegularGridEdges from "@/assets/viewer_svgs/surface_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
