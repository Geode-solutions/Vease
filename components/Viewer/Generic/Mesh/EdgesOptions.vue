<template>
  <ContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Edges options"
    :btn_image="props.btn_image"
  >
    <template #options>
      <VisibilitySwitch v-model="visibility" />
      <template v-if="visibility">
        <v-divider />
        <v-row class="pa-2" align="center">
          <v-col cols="auto" justify="center">
            <v-icon
              size="30"
              icon="mdi-format-color-fill"
              v-tooltip:left="'Filling'"
            />
          </v-col>
          <v-col justify="center">
            <v-select
              v-model="select"
              :items="styles"
              label="Select a color style"
            />
            <template v-if="select === styles[0]">
              <v-divider />
              <ConstantColorPicker v-model="color" />
            </template>
          </v-col>
        </v-row>
      </template>
    </template>
  </ContextMenuItem>
</template>

<script setup>
const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

console.log("GenericMeshEdgesOptions props", props.itemProps);
const id = toRef(() => props.itemProps.id);

const dataStyleStore = useDataStyleStore();

const visibility = computed({
  get() {
    return dataStyleStore.edgesVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setEdgesVisibility(id.value, newValue);
  },
});
const size = computed({
  get() {
    return dataStyleStore.edgesSize(id.value);
  },
  set(newValue) {
    dataStyleStore.setEdgesSize(id.value, newValue);
  },
});
const color = computed({
  get() {
    return dataStyleStore.edgesConstantColor(id.value);
  },
  set(newValue) {
    dataStyleStore.setEdgesConstantColor(id.value, newValue);
  },
});
const styles = ["Constant"];
const storeStyles = ["constant"];
const select = computed({
  get() {
    const active = dataStyleStore.edgesActiveColoring(id.value);
    for (let i = 0; i < styles.length; i++) {
      if (active === storeStyles[i]) {
        return styles[i];
      }
    }
    return "Select a coloring";
  },
  set(newValue) {
    for (let i = 0; i < styles.length; i++) {
      if (newValue === styles[i]) {
        dataStyleStore.setEdgesActiveColoring(id.value, storeStyles[i]);
        return;
      }
    }
  },
});
</script>
