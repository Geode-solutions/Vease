<script setup>
import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue";
import ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();

function expandToFullPage() {
  UIStore.setShowDataManagerPiP(false);
  navigateTo("/data-manager");
}

function close() {
  UIStore.setShowDataManagerPiP(false);
}
</script>

<template>
  <ResizablePiP
    storage-key="datamanager-pip"
    :default-width="560"
    :default-height="480"
    :min-width="690"
    :min-height="350"
  >
    <template #handle>
      <div
        class="pip-header d-flex align-center px-4"
        style="height: 40px; min-height: 40px; user-select: none"
      >
        <v-icon size="18" color="primary" class="mr-2">mdi-database</v-icon>
        <span class="text-subtitle-2 font-weight-bold text-white">Data Manager</span>
        <v-spacer />
        <v-btn icon size="x-small" variant="text" color="white" @click="expandToFullPage">
          <v-icon size="16">mdi-arrow-expand</v-icon>
          <v-tooltip activator="parent" location="top">Full screen</v-tooltip>
        </v-btn>
        <v-btn icon size="x-small" variant="text" color="white" @click="close">
          <v-icon size="16">mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Close</v-tooltip>
        </v-btn>
      </div>
    </template>

    <div class="d-flex flex-column overflow-hidden" style="flex: 1 1 0; min-height: 0">
      <DataManagerContent compact />
    </div>
  </ResizablePiP>
</template>

<style scoped>
.pip-header {
  cursor: grab;
}

.pip-header:active {
  cursor: grabbing;
}
</style>
