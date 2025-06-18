<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="Grid2D_Edges"
  />
</template>

<script setup>
import Grid2D_Edges from "@vease/assets/viewer_svgs/grid_2d_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
