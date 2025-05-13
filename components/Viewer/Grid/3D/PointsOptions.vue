<template>
  <ViewerGenericMeshPointsOptions
    :itemProps="props.itemProps"
    :btn_image="Grid3D_Points"
  />
</template>

<script setup>
import Grid3D_Points from "@vease/assets/viewer_svgs/grid_3d_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
