<template>
  <ViewerGenericMeshPointsColor :itemProps="props.itemProps">
    <template #btn>
      <v-img
        :src="SurfaceTrianglesColor"
        height="35"
        width="35"
      />
    </template>
  </ViewerGenericMeshPointsColor>
</template>

<script setup>
import SurfaceTrianglesColor from "@/assets/viewer_svgs/surface_triangles_color.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
});
console.log("ViewerSurfaceTrianglesColor props", props.itemProps);
</script>
