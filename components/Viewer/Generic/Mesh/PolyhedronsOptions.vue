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
          :active_coloring="active_coloring"
          :bool_color="true"
          :bool_vertex="true"
          :bool_polyhedrons="true"
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
const active_coloring = computed({
  get: () => dataStyleStore.polyhedronsActiveColoring(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsActiveColoring(id.value, newValue),
});
const color = computed({
  get: () => dataStyleStore.polyhedronsConstantColor(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsConstantColor(id.value, newValue),
});
const vertexAttributeName = computed({
  get: () => dataStyleStore.polyhedronsVertexAttributeName(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsVertexAttributeName(id.value, newValue),
});
const polyhedronAttributeName = computed({
  get: () => dataStyleStore.polyhedronsPolyhedronAttributeName(id.value),
  set: (newValue) =>
    dataStyleStore.setPolyhedronsPolyhedronAttributeName(id.value, newValue),
});
</script>
