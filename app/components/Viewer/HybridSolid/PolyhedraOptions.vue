<template>
  <ViewerGenericMeshPolyhedraOptions
    :itemProps="props.itemProps"
    :btn_image="HybridSolidPolyhedra"
  />
</template>

<script setup>
import HybridSolidPolyhedra from "@vease/assets/viewer_svgs/solid_polyhedra.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
