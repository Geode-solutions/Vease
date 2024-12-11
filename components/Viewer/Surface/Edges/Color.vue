<template>
  <ViewerGenericMeshEdgesColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="SurfaceEdgesColor"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshEdgesColor>
</template>

<script setup>
import SurfaceEdgesColor from "@/assets/viewer_svgs/surface_edges_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfaceEdgesColor props", props.itemProps);
</script>
