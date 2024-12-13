<template>
  <ViewerGenericMeshPointsColor
    :itemProps="props.itemProps"
    :btn_image="PointSetPointsColor"
  />
</template>

<script setup>
import PointSetPointsColor from "@/assets/viewer_svgs/point_set_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerPointSetPointsColor props", props.itemProps);
</script>
