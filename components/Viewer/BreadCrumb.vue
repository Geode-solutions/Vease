<template>
  <v-breadcrumbs class="mb-n10">
    <div class="d-flex align-center gap-2 ml-2 mb-2">
      <div
        v-if="!treeviewStore.isAdditionnalTreeDisplayed"
        class="d-flex align-center gap-2 ml-2 mt-2 mb-1"
      >
        <v-icon size="large">mdi-file-tree</v-icon>
        <h4>&nbsp;</h4>
        <span class="text-subtitle-1 font-weight-regular align-center mt-1"
          >File Tree</span
        >
      </div>

      <v-menu v-else offset-y>
        <template v-slot:activator="{ props }">
          <div class="d-flex align-center gap-2 ml-2 mb-1 mt-2" v-bind="props">
            <v-btn
              icon
              variant="text"
              size="medium"
              @click="treeviewStore.disaplayFileTree()"
            >
              <v-icon size="large">mdi-file-tree</v-icon>
            </v-btn>
            <h4>&nbsp;</h4>
            <span class="text-h5 font-weight-bold">/</span>
            <h4>&nbsp;</h4>
            <v-btn variant="text" size="medium">
              <v-icon size="x-large">{{ selectedTree.icon }}</v-icon>
              <v-icon small>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </template>
        <v-list class="bg-white">
          <v-list-item
            v-for="option in treeOptions"
            :key="option.value"
            @click="$emit('update:selectedTree', option)"
          >
            <v-list-item-title class="d-flex align-center">
              <v-icon size="small">{{ option.icon }}</v-icon>
              <h4>&nbsp;</h4>
              {{ option.text }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <span
        v-if="treeviewStore.isAdditionnalTreeDisplayed"
        class="text-subtitle-1 font-weight-regular align-center mt-1"
      >
        {{ selectedTree.text }}
      </span>
    </div>
  </v-breadcrumbs>
</template>

<script setup>
const props = defineProps({
  selectedTree: Object,
  treeOptions: Array,
});

const treeviewStore = use_treeview_store();
</script>
