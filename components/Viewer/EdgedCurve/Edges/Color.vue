<template>
  <ViewerGenericMeshEdgesColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="EdgedCurveEdgesColor"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshEdgesColor>
</template>

<script setup>
import EdgedCurveEdgesColor from "@/assets/viewer_svgs/edged_curve_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerEdgedCurveEdgesColor props", props.itemProps);
</script>