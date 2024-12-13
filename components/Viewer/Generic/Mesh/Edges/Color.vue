<template>
  <ContextMenuItem
    :itemProps="props.itemProps"
    tooltip="Edges color"
    :btn_image="props.btn_image"
  >
    <template #options>
      <v-switch v-model="visibility" inset label="Visibility" />
      <template v-if="visibility">
        <v-combobox
          v-model="select"
          :items="styles"
          label="Select color style"
        ></v-combobox>
        <ConstantColorPicker v-if="select === styles[0]" v-model="color" />
      </template>
    </template>
  </ContextMenuItem>
</template>

<script setup>
const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

console.log("ViewerGenericMeshEdgesColor props", props.itemProps);

const dataStyleStore = useDataStyleStore();
const tree_view_store = use_treeview_store();

const id = toRef(() => props.itemProps.id);
console.log("id", id.value);
const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(id.value);
});

console.log("meta_data", meta_data);

const visibility = computed({
  get() {
    return dataStyleStore.edgesVisibility(id.value);
  },
  set(newValue) {
    dataStyleStore.setEdgesVisibility(id.value, newValue);
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
