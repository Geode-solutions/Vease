<template>
  <ViewerGenericMeshPolyhedraOptions
    :itemProps="props.itemProps"
    :btn_image="SolidPolyhedra"
  />
</template>

<script setup>
import SolidPolyhedra from "@vease/assets/viewer_svgs/solid_polyhedra.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
