<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    :tooltip="props.tooltip"
    :btn_image="props.btn_image"
  >
    <template #options>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />
      <template v-if="visibility">
        <ViewerOptionsColoringTypeSelector
          :id="id"
          v-model:coloring_style_key="coloring_style_key"
          v-model:color="color"
          v-model:textures="textures"
          v-model:vertex_attribute="vertex_attribute"
          v-model:polygon_attribute="polygon_attribute"
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
  set: (newValue) =>
    dataStyleStore.setPolygonsActiveColoring(id.value, newValue),
});
const color = computed({
  get: () => dataStyleStore.polygonsColor(id.value),
  set: (newValue) => dataStyleStore.setPolygonsColor(id.value, newValue),
});
const textures = computed({
  get: () => dataStyleStore.polygonsTextures(id.value),
  set: (newValue) => dataStyleStore.setPolygonsTextures(id.value, newValue),
});
const vertex_attribute = computed({
  get: () => dataStyleStore.polygonsVertexAttribute(id.value),
  set: (newValue) => {
    console.log("setPolygonsVertexAttribute", id.value, newValue);
    dataStyleStore.setPolygonsVertexAttribute(id.value, newValue);
  },
});
const polygon_attribute = computed({
  get: () => dataStyleStore.polygonsPolygonAttribute(id.value),
  set: (newValue) => {
    console.log("setPolygonsPolygonAttribute", id.value, newValue);
    dataStyleStore.setPolygonsPolygonAttribute(id.value, newValue);
  },
});
</script>
