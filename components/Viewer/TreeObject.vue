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
          :items="treeviewStore.items"
          return-object
          class="transparent-treeview"
          item-value="id"
          select-strategy="classic"
          selectable
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

const { selection } = toRefs(treeviewStore);

function compare_selections(value, oldvalue) {
  const added = value.filter((item) => !oldvalue.includes(item));
  const removed = oldvalue.filter((item) => !value.includes(item));
  return { added, removed };
}

watch(selection, (value, oldvalue) => {
  const { added, removed } = compare_selections(value, oldvalue);
  for (const value of added) {
    dataStyleStore.setVisibility(value.id, true);
  }
  for (const value of removed) {
    dataStyleStore.setVisibility(value.id, false);
  }
});
</script>
