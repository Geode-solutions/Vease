<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Corner options"
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
    dataStyleStore.modelMeshComponentVisibility(id.value, "Corner", id.value),
  set: (newValue) =>
    dataStyleStore.setModelMeshComponentVisibility(
      id.value,
      "Corner",
      id.value,
      newValue
    ),
});

const coloring_style_key = computed({
  get: () => dataStyleStore.modelCornerActiveColoring(id.value),
  set: (newValue) =>
    dataStyleStore.setModelCornerActiveColoring(id.value, newValue),
});

const color = computed({
  get: () => dataStyleStore.modelCornerColor(id.value),
  set: (newValue) => dataStyleStore.setModelCornerColor(id.value, newValue),
});
</script>
