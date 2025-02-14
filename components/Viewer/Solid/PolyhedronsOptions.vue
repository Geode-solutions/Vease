<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="SolidPolyhedrons"
  />
</template>

<script setup>
import SolidPolyhedrons from "@/assets/viewer_svgs/solid_polyhedrons.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
