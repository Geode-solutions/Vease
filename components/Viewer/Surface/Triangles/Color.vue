<template>
  <ContextMenuItem v-bind="$attrs">
    <template #tooltip> Surface triangles color </template>
    <template #btn>
      <!-- <SurfaceColor
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      /> -->
      jvqufzqfzbfjzqbf
    </template>
    <template #options>
      <ViewerGenericMeshPointsColor/>
    </template>
  </ContextMenuItem>

</template>

<script setup>
import SurfaceColor from "@/assets/viewer_svgs/surface_color.svg";

const dataStyleStore = useDataStyleStore()
dataStyleStore.setMeshTrianglesColor()
</script>