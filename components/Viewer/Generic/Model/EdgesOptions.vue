<template>
  <ViewerContextMenuItem
    :itemProps="itemProps"
    tooltip="Edges options"
    :btn_image="SurfaceEdgesOptions"
  >
    <template #options>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />
    </template>
  </ViewerContextMenuItem>
</template>

<script setup>
import SurfaceEdgesOptions from "@vease/assets/viewer_svgs/surface_edges.svg";

const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

const id = toRef(() => props.itemProps.id);
const dataStyleStore = useDataStyleStore();

const visibility = computed({
  get: () => dataStyleStore.modelEdgesVisibility(id.value),
  set: (newValue) => dataStyleStore.setModelEdgesVisibility(id.value, newValue),
});
</script>
