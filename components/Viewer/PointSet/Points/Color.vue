<template>
  <ViewerGenericMeshPointsColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="PointSetPointsColor"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshPointsColor>
</template>

<script setup>
import PointSetPointsColor from "@/assets/viewer_svgs/point_set_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsColor props", props.itemProps);
</script>
