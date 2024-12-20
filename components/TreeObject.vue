<template>
  <v-container
    style="
      position: absolute;
      z-index: 2;
      left: 0;
      top: 0;
      background-color: transparent;
      border-radius: 16px;
    "
  >
    <v-row>
      <v-col cols="4" md="6">
        <v-treeview
          v-model:selected="selection"
          select-strategy="classic"
          :items="treeviewStore.items"
          selectable
          class="transparent-treeview"
          selected
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.transparent-treeview {
  background-color: transparent;
  color: rgb(0, 0, 0);
}
</style>

<script setup>
const treeviewStore = use_treeview_store();
const dataStyleStore = useDataStyleStore();

const selection = ref([])
// const selection = computed(() => dataStyleStore.selectedObjects.value);
console.log("TreeObject selection", dataStyleStore.items);

function compare_selections(value, oldvalue) {
  const added = value.filter((item) => !oldvalue.includes(item));
  const removed = oldvalue.filter((item) => !value.includes(item));
  return { added, removed };
}

watch(selection, (value, oldvalue) => {
  const { added, removed } = compare_selections(value, oldvalue);
  for (const id of added) {
    console.log("added id", id);
    dataStyleStore.setVisibility(id, true);
  }
  for (const id of removed) {
    console.log("removed id", id);
    dataStyleStore.setVisibility(id, false);
  }
});
</script>
