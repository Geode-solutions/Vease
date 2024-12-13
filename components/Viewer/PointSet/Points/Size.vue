<template>
  <ViewerGenericMeshPointsSize :itemProps="props.itemProps" :btn_image="PointSetPointsSize" />
</template>

<script setup>
import PointSetPointsSize from "@/assets/viewer_svgs/point_set_size.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerPointsSetPointsSize props", props.itemProps);
</script>