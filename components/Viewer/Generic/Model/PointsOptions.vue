<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Points options"
    :btn_image="props.btn_image"
  >
    <template #options>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />
      <template v-if="visibility">
        <v-row class="pa-0" align="center">
          <v-divider />
          <v-col cols="auto" justify="center">
            <v-icon size="30" icon="mdi-ruler" v-tooltip:left="'Size'" />
          </v-col>
          <v-col justify="center">
            <v-slider
              v-model="size"
              hide-details
              min="0"
              max="20"
              step="2"
              thumb-color="black"
              ticks
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <ViewerOptionsColoringTypeSelector
              :id="id"
              v-model:coloring_style_key="coloring_style_key"
              v-model:color="color"
            />
          </v-col>
        </v-row>
      </template>
    </template>
  </ViewerContextMenuItem>
</template>

<script setup>
const dataStyleStore = useDataStyleStore();

const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get: () => dataStyleStore.pointsVisibility(id.value),
  set: (newValue) => dataStyleStore.setPointsVisibility(id.value, newValue),
});
const size = computed({
  get: () => dataStyleStore.pointsSize(id.value),
  set: (newValue) => dataStyleStore.setPointsSize(id.value, newValue),
});
const coloring_style_key = computed({
  get: () => dataStyleStore.pointsActiveColoring(id.value),
  set: (newValue) => dataStyleStore.setPointsActiveColoring(id.value, newValue),
});
const color = computed({
  get: () => dataStyleStore.pointsColor(id.value),
  set: (newValue) => dataStyleStore.setPointsColor(id.value, newValue),
});
const vertex_attribute = computed({
  get: () => dataStyleStore.pointsVertexAttribute(id.value),
  set: (newValue) =>
    dataStyleStore.setPointsVertexAttribute(id.value, newValue),
});
</script>
