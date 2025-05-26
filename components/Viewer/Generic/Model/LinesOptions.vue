<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Line options"
    :btn_image="props.btn_image"
  >
    <template #options>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />
      <template v-if="visibility">
        <ViewerOptionsColoringTypeSelector
          :id="id"
          v-model:coloring_style_key="coloring_style_key"
          v-model:color="color"
        />
      </template>
    </template>
  </ViewerContextMenuItem>
</template>

<script setup>
const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

const id = toRef(() => props.itemProps.id);

const dataStyleStore = useDataStyleStore();

const visibility = computed({
  get: () =>
    dataStyleStore.modelMeshComponentVisibility(id.value, "Line", id.value),
  set: (newValue) =>
    dataStyleStore.setModelMeshComponentVisibility(
      id.value,
      "Line",
      id.value,
      newValue
    ),
});

const coloring_style_key = computed({
  get: () => dataStyleStore.modelLineActiveColoring(id.value),
  set: (newValue) =>
    dataStyleStore.setModelLineActiveColoring(id.value, newValue),
});

const color = computed({
  get: () => dataStyleStore.modelLineColor(id.value),
  set: (newValue) => dataStyleStore.setModelLineColor(id.value, newValue),
});
</script>
