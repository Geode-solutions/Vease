<template>
  <ViewerGenericMeshPointsSize
    :itemProps="props.itemProps"
    :btn_image="EdgedCurvePointsSize"
  />
</template>

<script setup>
import EdgedCurvePointsSize from "@/assets/viewer_svgs/edged_curve_point_size.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerEdgedCurvePointsSize props", props.itemProps);
</script>
