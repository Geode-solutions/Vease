<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Edges options"
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
  get: () => dataStyleStore.edgesVisibility(id.value),
  set: (newValue) => dataStyleStore.setEdgesVisibility(id.value, newValue),
});
const size = computed({
  get: () => dataStyleStore.edgesSize(id.value),
  set: (newValue) => dataStyleStore.setEdgesSize(id.value, newValue),
});
const coloring_style_key = computed({
  get: () => dataStyleStore.edgesActiveColoring(id.value),
  set: (newValue) => {
    dataStyleStore.setEdgesActiveColoring(id.value, newValue);
  },
});
const color = computed({
  get: () => dataStyleStore.edgesColor(id.value),
  set: (newValue) => dataStyleStore.setEdgesColor(id.value, newValue),
});
</script>
