<template>
  <v-container>
    <v-row>
      <v-col>
        <v-treeview
          v-model:selected="treeviewStore.selection"
          :items="treeviewStore.items"
          :select-strategy="treeviewStore.selectionType"
          return-object
          selectable
          class="transparent-treeview"
        ></v-treeview>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.transparent-treeview {
  background-color: transparent;
  color: white;
}
</style>

<script setup>
const treeviewStore = useTreeviewStore();
</script>
