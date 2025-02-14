<template>
  <ViewerGenericMeshPolyhedronsOptions
    :itemProps="props.itemProps"
    :btn_image="TetrahedralSolidTetrahedrons"
    tooltip="Tetrahedrons options"
  />
</template>

<script setup>
import TetrahedralSolidTetrahedrons from "@/assets/viewer_svgs/solid_polyhedrons.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
