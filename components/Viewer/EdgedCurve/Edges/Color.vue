<template>
  <ViewerGenericMeshEdgesColor
    :itemProps="props.itemProps"
    :btn_image="EdgedCurveEdgesColor"
  />
</template>

<script setup>
import EdgedCurveEdgesColor from "@/assets/viewer_svgs/edged_curve_color.svg";



console.log("EdgedCurveEdgesColor", EdgedCurveEdgesColor, typeof EdgedCurveEdgesColor);
const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerEdgedCurveEdgesColor props", props.itemProps);
</script>
