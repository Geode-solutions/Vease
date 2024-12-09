<template>
    <ViewerGenericMeshPointsColor :itemProps="props.itemProps">
      <template #btn>
        <v-img
          :src="EdgeCurvePointsColor"
          height="35"
          width="35"
        />
      </template>
    </ViewerGenericMeshPointsColor>
  </template>
  
  <script setup>
  import EdgeCurvePointsColor from "@/assets/viewer_svgs/edged_curve_point_color.svg";
  
  const props = defineProps({
    itemProps: { type: Object, required: true },
  });
  console.log("ViewerEdgedCurvePointsColor props", props.itemProps);
  </script>