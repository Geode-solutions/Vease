<template>
  <ViewerGenericMeshPointsColor
    :itemProps="props.itemProps"
    :btn_image="EdgedCurvePointsColor"
  />
</template>

<script setup>
import EdgedCurvePointsColor from "@/assets/viewer_svgs/edged_curve_point_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerEdgedCurvePointsColor props", props.itemProps);
</script>
