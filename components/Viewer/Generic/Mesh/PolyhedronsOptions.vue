<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    :tooltip="props.tooltip"
    :btn_image="props.btn_image"
  >
    <template #options>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />

      <template v-if="visibility">
        <v-divider />
        <v-row class="pa-2" align="center">
          <v-col cols="auto" justify="center">
            <v-icon size ="30" icon="mdi-format-color-fill" v-tooltip:left="'Filling'" />
          </v-col>
          <v-col justify="center">
            <v-select
              v-model="select"
              :items="styles"
              width="200"
              label="Select a color style"
            />

            <template v-if="select === styles[0]">
              <v-divider />
              <ViewerOptionsConstantColorPicker v-model="color" />
            </template>

            <template v-if="select === styles[1]">
              <v-divider />
              <ViewerOptionsVertexAttributeSelector v-model="vertexAttributeName" :id="id" />
            </template>

            <template v-if="select === styles[2]">
              <v-divider />
              <ViewerOptionsPolygonAttributeSelector
                v-model="polygonAttributeName"
                :id="id"
              />
            </template>
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
  tooltip: { type: String, required: false, default: "Polyhedrons options" },
});

const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get() {
    return dataStyleStore.polyhedronsVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolyhedronsVisibility(id.value, newValue);
  },
});
const color = computed({
  get() {
    return dataStyleStore.polyhedronsConstantColor(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolyhedronsConstantColor(id.value, newValue);
  },
});
const styles = ["Constant", "From vertex attribute"];
const storeStyles = ["constant", "vertex"];
const select = computed({
  get() {
    const active = dataStyleStore.polyhedronsActiveColoring(id.value);
    for (let i = 0; i < styles.length; i++) {
      if (active === storeStyles[i]) {
        return styles[i];
      }
    }
    return "";
  },
  set(newValue) {
    for (let i = 0; i < styles.length; i++) {
      if (newValue === styles[i]) {
        dataStyleStore.setPolyhedronsActiveColoring(id.value, storeStyles[i]);
        return;
      }
    }
  },
});
const vertexAttributeName = computed({
  get() {
    return dataStyleStore.polyhedronsVertexAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolyhedronsVertexAttributeName(id.value, newValue);
  },
});

const polygonAttributeName = computed({
  get() {
    return dataStyleStore.polyhedronsPolygonAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolyhedronsPolygonAttributeName(id.value, newValue);
  },
});
</script>
