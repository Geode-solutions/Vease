<template>
  <ContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Triangles color"
    :btn_image="props.btn_image"
  >
    <template #options>
      <VisibilitySwitch v-model="visibility" />
      <template v-if="visibility">
        <v-combobox
          v-model="select"
          :items="styles"
          label="Select color style"
        ></v-combobox>
        <ConstantColorPicker v-if="select === styles[0]" v-model="color" />
        <VertexAttributeSelector
          v-if="select === styles[1]"
          v-model="vertexAttributeName"
          :id="id"
        />
        <PolygonAttributeSelector
          v-if="select === styles[2]"
          v-model="polygonAttributeName"
          :id="id"
        />
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

console.log("ViewerGenericMeshTrianglesColor props", props.itemProps);
const id = toRef(() => props.itemProps.id);

const visibility = computed({
  get() {
    return dataStyleStore.trianglesVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setTrianglesVisibility(id.value, newValue);
  },
});
const color = computed({
  get() {
    return dataStyleStore.trianglesConstantColor(id.value);
  },
  set(newValue) {
    dataStyleStore.setTrianglesConstantColor(id.value, newValue);
  },
});
const styles = ["Constant", "From vertex attribute"];
const storeStyles = ["constant", "vertex"];
const select = computed({
  get() {
    const active = dataStyleStore.trianglesActiveColoring(id.value);
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
        dataStyleStore.setTrianglesActiveColoring(id.value, storeStyles[i]);
        return;
      }
    }
  },
});
const vertexAttributeName = computed({
  get() {
    return dataStyleStore.trianglesVertexAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setTrianglesVertexAttributeName(id.value, newValue);
  },
});

const polygonAttributeName = computed({
  get() {
    return dataStyleStore.trianglesPolygonAttributeName(id.value);
  },
  set(newValue) {
    dataStyleStore.setTrianglesPolygonAttributeName(id.value, newValue);
  },
});
</script>
