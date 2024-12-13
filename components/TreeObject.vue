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
      <v-col cols="12" md="12">
        <v-treeview
          v-model:selected="selection"
          select-strategy="classic"
          item-value="id"
          return-object
          :items="treeviewStore.items"
          selectable
          class="transparent-treeview"
          selected
        >
        </v-treeview>
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
// const dataStyleStore = useDataStyleStore();
const { selection } = toRefs(treeviewStore);

// function compare_selections(value, oldvalue) {
//   const added = value.filter((item) => !oldvalue.includes(item));
//   const removed = oldvalue.filter((item) => !value.includes(item));
//   return { added, removed };
// }

watch(selection, (value, oldvalue) => {
  const { added, removed } = compare_selections(value, oldvalue);
  for (const file of added) {
    dataStyleStore.setVisibility(file.id, true);
  }
  for (const file of removed) {
    dataStyleStore.setVisibility(file.id, false);
  }
});
</script>
