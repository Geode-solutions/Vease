<template>
  <ViewerGenericMeshEdgesSize
    :itemProps="props.itemProps"
    :btn_image="EdgedCurveEdgesSize"
  />
</template>

<script setup>
import EdgedCurveEdgesSize from "@/assets/viewer_svgs/edged_curve_size.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerEdgedCurvePointsSize props", props.itemProps);
</script>
