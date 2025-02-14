<template>
  <ViewerGenericMeshEdgesOptions
    :itemProps="props.itemProps"
    :btn_image="Grid3D_Edges"
  />
</template>

<script setup>
import Grid3D_Edges from "@/assets/viewer_svgs/grid_3d_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
