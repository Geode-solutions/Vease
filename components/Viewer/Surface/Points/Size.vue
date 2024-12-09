<template>
  <ViewerGenericMeshPointsSize :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="SurfacePointsSize"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshPointsSize>
</template>

<script setup>
import SurfacePointsSize from "@/assets/viewer_svgs/surface_points_size.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsSize props", props.itemProps);
</script>