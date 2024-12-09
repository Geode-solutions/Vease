<template>
  <ViewerGenericMeshPointsColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="SurfacePointsColor"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshPointsColor>
</template>

<script setup>
import SurfacePointsColor from "@/assets/viewer_svgs/surface_points_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsColor props", props.itemProps);
</script>
