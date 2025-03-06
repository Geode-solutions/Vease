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
          v-model:vertex_attribute="vertex_attribute"
          v-model:polyhedron_attribute="polyhedron_attribute"
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
  tooltip: { type: String, required: false, default: "Polyhedrons options" },
});

const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get: () => dataStyleStore.polyhedronsVisibility(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsVisibility(id.value, newValue),
});
const coloring_style_key = computed({
  get: () => dataStyleStore.polyhedronsActiveColoring(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsActiveColoring(id.value, newValue),
});
const color = computed({
  get: () => dataStyleStore.polyhedronsColor(id.value),
  set: (newValue) => dataStyleStore.setPolyhedronsColor(id.value, newValue),
});
const vertex_attribute = computed({
  get: () => dataStyleStore.polyhedronsVertexAttribute(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsVertexAttribute(id.value, newValue),
});
const polyhedron_attribute = computed({
  get: () => dataStyleStore.polyhedronsPolyhedronAttribute(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsPolyhedronAttribute(id.value, newValue),
});
</script>
