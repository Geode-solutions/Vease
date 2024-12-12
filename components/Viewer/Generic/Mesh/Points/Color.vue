<template>
  <ContextMenuItem v-bind="itemProps">
    <template #tooltip>Points color</template>
    <template #btn>
      <slot name="btn"></slot>
    </template>
    <template #options>
      <v-card>
        <v-card-text class="justify-center">
          <v-switch v-model="visibility" inset label="Visibility" />
          <template v-if="visibility">
            <v-combobox
              v-model="select"
              :items="styles"
              label="Select color style"
            ></v-combobox>
            <ConstantColorPicker v-if="select === styles[0]" v-model="color"/>
            <VertexAttributeSelector v-if="select === styles[1]" v-model="vertexAttributeName"/>
          </template>
        </v-card-text>
      </v-card>
    </template>
  </ContextMenuItem>
</template>

<script setup>
const dataStyleStore = useDataStyleStore();
const tree_view_store = use_treeview_store();

const props = defineProps({
  itemProps: { type: Object, required: true },
});

console.log("ViewerGenericMeshPointsColor props", props.itemProps);

const id = toRef(() => props.itemProps.id);
console.log("id", id.value);
const meta_data = computed(() => {
  return tree_view_store.idMetaData(id.value);
});

console.log("meta_data", meta_data);

const visibility = computed({
  get() {
    return dataStyleStore.pointsVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setPointsVisibility(id.value, newValue);
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
const styles = ["Constant", "From vertex attribute"];
const storeStyles = ["constant", "vertex"];
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
