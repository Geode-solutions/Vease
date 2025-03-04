<template>
  <ViewerContextMenuItem
    :itemProps="props.itemProps"
    :tooltip="props.tooltip"
    :btn_image="props.btn_image"
  >
    <template #options @click.stop>
      <ViewerOptionsVisibilitySwitch v-model="visibility" />

      <template v-if="visibility">
        <v-row align="center" justify="center">
          <v-divider />
          <v-col cols="auto">
            <v-icon
              size="30"
              icon="mdi-format-color-fill"
              v-tooltip:left="'Filling'"
            />
          </v-col>
          <v-col>
            <v-select
              v-model="select"
              :items="styles"
              width="200"
              label="Select a color style"
              density="compact"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <template v-if="select === styles[0]">
              <ViewerOptionsConstantColorPicker v-model="color" />
            </template>
            <template v-if="select === styles[1]">
              <ViewerOptionsTexturesSelector v-model="textures" :id="id" />
            </template>
            <template v-if="select === styles[2]">
              <ViewerOptionsVertexAttributeSelector
                v-model="vertexAttributeName"
                :id="id"
              />
            </template>
            <template v-if="select === styles[3]">
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
  tooltip: { type: String, required: false, default: "Polygons options" },
});

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
const styles = ["Constant", "Texture", "From vertex attribute"];
const storeStyles = ["constant", "textures", "vertex"];
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
const textures = computed({
  get() {
    return dataStyleStore.polygonsTextures(id.value);
  },
  set(newValue) {
    console.log("SET TEXTURES", newValue);
    dataStyleStore.setPolygonsTextures(id.value, newValue);
  },
});
const vertexAttributeName = computed({
  get() {
    return dataStyleStore.polygonsVertexAttributeName(id.value);
  },
  set(newValue) {
    console.log("SET vertexAttributeName newValue", newValue);
    if (newValue !== "") {
      dataStyleStore.setPolygonsVertexAttributeName(id.value, newValue);
    }
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
