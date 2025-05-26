<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Surface options"
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
    dataStyleStore.modelMeshComponentVisibility(id.value, "Surface", id.value),
  set: (newValue) =>
    dataStyleStore.setModelMeshComponentVisibility(
      id.value,
      "Surface",
      id.value,
      newValue
    ),
});

const coloring_style_key = computed({
  get: () => dataStyleStore.modelSurfaceActiveColoring(id.value),
  set: (newValue) =>
    dataStyleStore.setModelSurfaceActiveColoring(id.value, newValue),
});

const color = computed({
  get: () => dataStyleStore.modelSurfaceColor(id.value),
  set: (newValue) => dataStyleStore.setModelSurfaceColor(id.value, newValue),
});

const textures = computed({
  get: () => dataStyleStore.modelSurfaceTextures(id.value),
  set: (newValue) => dataStyleStore.setModelSurfaceTextures(id.value, newValue),
});
</script>
