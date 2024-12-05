<template>
    <ContextMenuItem v-bind="itemProps">
      <template #tooltip> Surface triangles color </template>
      <template #btn>
        <SurfaceEdgesColor/>
      </template>
      <template #options>
        <ViewerGenericMeshEdgesColor/>
      </template>
    </ContextMenuItem>
  
  </template>
  
  <script setup>
  import SurfaceEdgesColor from "@/assets/viewer_svgs/surface_color.svg";
  
  const props = defineProps({
    itemProps: { type: Object, required: true },
  })


  console.log("itemProps", props.itemProps)
  const dataStyleStore = useDataStyleStore()
  dataStyleStore.setMeshTrianglesColor()
  </script>