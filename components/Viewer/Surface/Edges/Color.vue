<template>
  <ViewerGenericMeshEdgesColor
    :itemProps="props.itemProps"
    :btn_image="SurfaceEdgesColor"
  />
</template>

<script setup>
import SurfaceEdgesColor from "@/assets/viewer_svgs/surface_edges_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfaceEdgesColor props", props.itemProps);
</script>
