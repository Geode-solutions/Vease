<template>
  <ViewerGenericModelPointsOptions
    :itemProps="itemProps"
    :btn_image="EdgedCurvePoints"
  />
</template>

<script setup>
import EdgedCurvePoints from "@vease/assets/viewer_svgs/edged_curve_points.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
</script>
