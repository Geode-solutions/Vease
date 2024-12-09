<template>
  <ViewerGenericMeshPointsColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        src="@/assets/viewer_svgs/surface.svg"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshPointsColor>
</template>

<script setup>
import Surface from "@/assets/viewer_svgs/surface.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfacePointsColor props", props.itemProps);
</script>
