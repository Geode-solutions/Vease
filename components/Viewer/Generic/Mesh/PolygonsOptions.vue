<template>
  <ContextMenuItem
    :itemProps="props.itemProps"
    :tooltip="props.tooltip"
    :btn_image="props.btn_image"
  >
    <template #options>
      <VisibilitySwitch v-model="visibility" />

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
              <ConstantColorPicker v-model="color" />
            </template>

            <template v-if="select === styles[1]">
              <v-divider />
              <VertexAttributeSelector v-model="vertexAttributeName" :id="id" />
            </template>

            <template v-if="select === styles[2]">
              <v-divider />
              <PolygonAttributeSelector
                v-model="polygonAttributeName"
                :id="id"
              />
            </template>
          </v-col>
        </v-row>
      </template>
    </template>
  </ContextMenuItem>
</template>

<script setup>
const dataStyleStore = useDataStyleStore();

const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
  tooltip: { type: String, required: true },
});

console.log("GenericMeshPolygonsOptions props", props.itemProps);
const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get() {
    return dataStyleStore.polygonsVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolygonsVisibility(id.value, newValue);
  },
});
const color = computed({
  get() {
    return dataStyleStore.polygonsConstantColor(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolygonsConstantColor(id.value, newValue);
  },
});
const styles = ["Constant", "From vertex attribute"];
const storeStyles = ["constant", "vertex"];
const select = computed({
  get() {
    const active = dataStyleStore.polygonsActiveColoring(id.value);
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
        dataStyleStore.setPolygonsActiveColoring(id.value, storeStyles[i]);
        return;
      }
    }
  },
});
const vertexAttributeName = computed({
  get() {
    return dataStyleStore.polygonsVertexAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolygonsVertexAttributeName(id.value, newValue);
  },
});

const polygonAttributeName = computed({
  get() {
    return dataStyleStore.polygonsPolygonAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setPolygonsPolygonAttributeName(id.value, newValue);
  },
});
</script>
