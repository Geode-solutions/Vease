<template>
  <ViewerGenericMeshEdgesColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="EdgeCurveEdgesColor"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshEdgesColor>
</template>

<script setup>
import EdgeCurveEdgesColor from "@/assets/viewer_svgs/edged_curve_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsColor props", props.itemProps);
</script>