<template>
  <v-container @click="console.log('#######')"
  >
    <!-- style="
      position: absolute;
      z-index: 2;
      left: 0;
      top: 0;
      background-color: transparent;
      border-radius: 16px;
    " -->
    <v-row>
      <v-col cols="4" md="6">
        <v-treeview
        :items="treeviewStore.items"
        />
        <!-- return-object -->
        <!-- class="transparent-treeview" -->
        <!-- item-value="id" -->
        <!-- v-model:selected="selection" -->
          <!-- select-strategy="classic" -->
          <!-- selected -->
          <!-- selectable -->
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

// const selection = ref(dataStyleStore.selectedObjects.value)
// const { selection } = toRefs(treeviewStore);
// console.log("selection", selection);
// console.log("selectedObjects", dataStyleStore.selectedObjects.value);

// const selection = computed(() => dataStyleStore.selectedObjects.value);
console.log("TreeObject items", treeviewStore.items);

function compare_selections(value, oldvalue) {
  const added = value.filter((item) => !oldvalue.includes(item));
  const removed = oldvalue.filter((item) => !value.includes(item));
  return { added, removed };
}

// watch(selection, (value, oldvalue) => {
//   console.log("selection changed", value, oldvalue);
//   const { added, removed } = compare_selections(value, oldvalue);
//   for (const id of added) {
//     console.log("added id", id);
//     dataStyleStore.setVisibility(id, true);
//   }
//   for (const id of removed) {
//     console.log("removed id", id);
//     dataStyleStore.setVisibility(id, false);
//   }
// });
</script>
