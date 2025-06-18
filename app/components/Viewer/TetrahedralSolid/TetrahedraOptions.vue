<template>
  <ViewerGenericMeshPolyhedraOptions
    :itemProps="props.itemProps"
    :btn_image="TetrahedralSolidTetrahedra"
    tooltip="Tetrahedra options"
  />
</template>

<script setup>
import TetrahedralSolidTetrahedra from "@vease/assets/viewer_svgs/solid_polyhedra.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
