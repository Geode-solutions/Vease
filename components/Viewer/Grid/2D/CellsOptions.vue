<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="Grid2D_Cells"
    tooltip="Cells options"
  />
</template>

<script setup>
import Grid2D_Cells from "@vease/assets/viewer_svgs/grid_2d_cells.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
