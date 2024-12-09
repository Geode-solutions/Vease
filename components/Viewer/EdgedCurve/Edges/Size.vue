<template>
    <ViewerGenericMeshEdgesSize :itemProps="props.itemProps">
      <template #btn>
        <v-img
          :src="EdgedCurveEdgesSize"
          height="35"
          width="35"
        />
      </template>
    </ViewerGenericMeshEdgesSize>
  </template>
  
  <script setup>
  import EdgedCurveEdgesSize from "@/assets/viewer_svgs/edged_curve_size.svg";
  
  const props = defineProps({
    itemProps: { type: Object, required: true },
  });
  console.log("ViewerEdgedCurvePointsSize props", props.itemProps);
  </script>