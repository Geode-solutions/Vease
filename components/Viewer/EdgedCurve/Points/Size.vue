<template>
    <ViewerGenericMeshPointsSize :itemProps="props.itemProps">
      <template #btn>
        <v-img
          :src="EdgedCurvePointsSize"
          height="35"
          width="35"
        />
      </template>
    </ViewerGenericMeshPointsSize>
  </template>
  
  <script setup>
  import EdgedCurvePointsSize from "@/assets/viewer_svgs/edged_curve_point_size.svg";
  
  const props = defineProps({
    itemProps: { type: Object, required: true },
  });
  console.log("ViewerEdgedCurvePointsSize props", props.itemProps);
  </script>