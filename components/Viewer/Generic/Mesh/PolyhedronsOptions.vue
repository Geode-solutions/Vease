<template>
    <ViewerContextMenuItem
      :itemProps="props.itemProps"
      tooltip="Polyhedrons options"
      :btn_image="props.btn_image"
    >
      <template #options>
        <ViewerOptionsVisibilitySwitch v-model="visibility" />
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
                <ViewerOptionsConstantColorPicker v-model="color" />
              </template>
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
    get() {
      return dataStyleStore.polyhedronsVisibility(id.value);
    },
    set(newValue) {
      dataStyleStore.setPolyhedronsVisibility(id.value, newValue);
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
  