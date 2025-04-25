<template>
  <v-breadcrumbs class="mb-n10 breadcrumb-container">
    <div class="d-flex align-center gap-2 ml-2 mb-2">
      <div
        v-if="!treeviewStore.isAdditionnalTreeDisplayed"
        class="d-flex align-center gap-2 ml-2 mt-2 mb-1"
      >
        <v-icon size="large">mdi-file-tree</v-icon>
        <h4>&nbsp;</h4>
        <span class="text-subtitle-1 font-weight-regular align-center mt-1">
          TreeComponent
        </span>
      </div>

      <v-menu v-else offset-y>
        <template v-slot:activator="{ props }">
          <div class="d-flex align-center gap-2 ml-2 mb-1 mt-2" v-bind="props">
            <v-btn icon variant="text" size="medium" @click="goBackToFileTree">
              <v-icon size="large">mdi-file-tree</v-icon>
            </v-btn>
            <h4>&nbsp;</h4>
            <span class="text-h5 font-weight-bold">/</span>
            <h4>&nbsp;</h4>
            <v-btn variant="text" size="medium">
              <v-icon size="x-large">{{
                selectedTree && selectedTree.icon
                  ? selectedTree.icon
                  : "mdi-shape-outline"
              }}</v-icon>

              <v-icon small>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </template>
        <v-list class="bg-white">
          <v-list-item
            v-for="option in treeOptions"
            :key="option.value"
            @click="selectTree(option)"
          >
            <v-list-item-title class="d-flex align-center">
              <v-icon size="small">{{ option.icon }}</v-icon>
              <span>{{ option.text }}</span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item @click="switchTreeView">
            <v-list-item-title class="d-flex align-center">
              <v-icon small>mdi-rhombus-split</v-icon>
              <span>TreeCollection</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- <span class="text-subtitle-1 font-weight-regular align-center mt-1">
        TreeComponent
      </span> -->
      <span
        v-if="treeviewStore.isAdditionnalTreeDisplayed && selectedTree"
        class="text-subtitle-1 font-weight-regular align-center mt-1"
      >
        {{ selectedTree ? selectedTree.text : "No tree selected" }}
      </span>
    </div>
  </v-breadcrumbs>
</template>

<script setup>
const props = defineProps({
  treeOptions: {
    type: Array,
    required: true,
  },
});

const treeviewStore = use_treeview_store();

const selectedTree = computed(() => treeviewStore.selectedTree);

const goBackToFileTree = () => {
  treeviewStore.displayFileTree();
};

const selectTree = (option) => {
  treeviewStore.selectedTree = option;
};

const switchTreeView = () => {
  treeviewStore.toggleTreeView();
};
</script>

<style scoped>
.breadcrumb-container {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
</style>
