<template>
  <ViewerGenericMeshPointsSize :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="PointSetPointsSize"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshPointsSize>
</template>

<script setup>
import PointSetPointsSize from "@/assets/viewer_svgs/point_set_size.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsSize props", props.itemProps);
</script>