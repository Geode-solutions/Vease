<template>
  <ViewerContextMenuItem
    :itemProps="itemProps"
    tooltip="Edges options"
    :btn_image="EdgedCurveEdges"
  >
    <template #options>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />
    </template>
  </ViewerContextMenuItem>
</template>

<script setup>
import EdgedCurveEdges from "@vease/assets/viewer_svgs/edged_curve_edges.svg";

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
