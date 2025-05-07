<template>
  <ViewerGenericMeshPolygonsOptions
    :itemProps="props.itemProps"
    :btn_image="Grid3D_Facets"
    tooltip="Facets options"
  />
</template>

<script setup>
import Grid3D_Facets from "@vease/assets/viewer_svgs/grid_3d_facets.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
