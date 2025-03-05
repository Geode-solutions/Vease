<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    :tooltip="props.tooltip"
    :btn_image="props.btn_image"
  >
    <template #options @click.stop>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />
      <template v-if="visibility">
        <ViewerOptionsColoringTypeSelector
          :id="id"
          :coloring_style_key="coloring_style_key"
          :coloring_value="color"
          bool_color
          bool_textures
          bool_vertex
          bool_polygons
        />
      </template>
    </template>
  </ViewerContextMenuItem>
</template>

<script setup>
const dataStyleStore = useDataStyleStore();

const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
  tooltip: { type: String, required: false, default: "Polygons options" },
});

const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get: () => dataStyleStore.polygonsVisibility(id.value),
  set: (newValue) => dataStyleStore.setPolygonsVisibility(id.value, newValue),
});
const coloring_style_key = computed({
  get: () => dataStyleStore.polygonsActiveColoring(id.value),
  set: (newValue) => {
    console.log("coloring_style_key", newValue);
    dataStyleStore.setPolygonsActiveColoring(id.value, newValue);
  },
});
const color = computed({
  get: () => dataStyleStore.polygonsConstantColor(id.value),
  set: (newValue) =>
    dataStyleStore.setPolygonsConstantColor(id.value, newValue),
});
const textures = computed({
  get: () => dataStyleStore.polygonsTextures(id.value),
  set: (newValue) => dataStyleStore.setPolygonsTextures(id.value, newValue),
});
const vertexAttributeName = computed({
  get: () => dataStyleStore.polygonsVertexAttributeName(id.value),
  set: (newValue) =>
    dataStyleStore.setPolygonsVertexAttributeName(id.value, newValue),
});
const polygonAttributeName = computed({
  get: () => dataStyleStore.polygonsPolygonAttributeName(id.value),
  set: (newValue) =>
    dataStyleStore.setPolygonsPolygonAttributeName(id.value, newValue),
});
</script>
