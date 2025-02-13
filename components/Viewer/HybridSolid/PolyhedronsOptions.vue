<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidPolyhedrons"
  />
</template>

<script setup>
import HybridSolidPolyhedrons from "@/assets/viewer_svgs/solid_polyhedrons.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
