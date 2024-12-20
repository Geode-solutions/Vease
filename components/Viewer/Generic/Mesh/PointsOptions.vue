<template>
  <ContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Points options"
    :btn_image="props.btn_image"
  >
    <template #options>
      <VisibilitySwitch v-model="visibility" />

      <template v-if="visibility">
        <v-divider />
        <v-row class="pa-2" align="center">
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
              width="200"
              label="Select a color style"
            />

            <template v-if="select === styles[0]">
              <v-divider />
              <ConstantColorPicker
                v-if="select === styles[0]"
                v-model="color"
              />
            </template>

            <!-- <template v-if="select === styles[1]">
              <v-divider />
              <VertexAttributeSelector v-model="vertexAttributeName" :id="id" />
            </template> -->
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
});

console.log("GenericMeshPointsOptions props", props.itemProps);
const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get() {
    return dataStyleStore.pointsVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setPointsVisibility(id.value, newValue);
  },
});
const size = computed({
  get() {
    return dataStyleStore.pointsSize(id.value);
  },
  set(newValue) {
    dataStyleStore.setPointsSize(id.value, newValue);
  },
});
const color = computed({
  get() {
    return dataStyleStore.pointsConstantColor(id.value);
  },
  set(newValue) {
    dataStyleStore.setPointsConstantColor(id.value, newValue);
  },
});
const styles = ["Constant"]; // "From vertex attribute"
const storeStyles = ["constant"]; // "vertex"
const select = computed({
  get() {
    const active = dataStyleStore.pointsActiveColoring(id.value);
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
        dataStyleStore.setPointsActiveColoring(id.value, storeStyles[i]);
        return;
      }
    }
  },
});
const vertexAttributeName = computed({
  get() {
    return dataStyleStore.pointsVertexAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setPointsVertexAttributeName(id.value, newValue);
  },
});
</script>
