<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Model options"
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
            <v-slider v-model="size" hide-details min="0" max="20" />
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
const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

const id = toRef(() => props.itemProps.id);

const dataStyleStore = useDataStyleStore();

const visibility = computed({
  get: () => dataStyleStore.styles[id.value].visibility,
  set: (value) => dataStyleStore.setModelVisibility(id.value, value),
});

const size = computed({
  get: () => dataStyleStore.styles[id.value].size,
  set: (newValue) => dataStyleStore.setModelSize(id.value, newValue),
});

const coloring_style_key = computed({
  get: () => dataStyleStore.styles[id.value].coloring_style_key,
  set: (newValue) =>
    dataStyleStore.setModelColoringStyleKey(id.value, newValue),
});

const color = computed({
  get: () => dataStyleStore.styles[id.value].color,
  set: (newValue) => dataStyleStore.setModelColor(id.value, newValue),
});
</script>
