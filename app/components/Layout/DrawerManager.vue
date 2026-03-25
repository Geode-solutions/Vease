<script setup>
import CreateTools from "@vease/components/CreateTools";
import DataManagerPiP from "@vease/components/datamanager/DataManagerPiP.vue";
import DragAndDrop from "@ogw_front/components/DragAndDrop";
import Extension from "@vease/components/Extension";
import GlassCard from "@ogw_front/components/GlassCard";
import StepImport from "@vease/components/StepImport";

const { uiStore } = defineProps({
  uiStore: { type: Object, required: true },
});

const emit = defineEmits(["files-dropped"]);

function closeAllDrawers() {
  uiStore.setShowStepper(false);
  uiStore.setShowCreateTools(false);
  uiStore.setShowExtensions(false);
}

function handleFilesDropped(files) {
  emit("files-dropped", files);
}
</script>

<template>
  <v-fade-transition>
    <div
      v-if="uiStore.showStepper || uiStore.showCreateTools || uiStore.showExtensions"
      class="drawer-overlay"
      @click="closeAllDrawers"
    />
  </v-fade-transition>

  <v-fade-transition>
    <v-card
      v-if="uiStore.showStepper || uiStore.showCreateTools"
      color="transparent"
      elevation="0"
      :width="548"
      class="drawer-container right-0"
    >
      <GlassCard
        variant="panel"
        padding="pa-0"
        class="fill-height overflow-hidden border-0"
      >
        <StepImport
          v-if="uiStore.showStepper"
          :files="uiStore.droppedFiles"
          @close="uiStore.setShowStepper(false)"
        />
        <CreateTools v-if="uiStore.showCreateTools" />
      </GlassCard>
    </v-card>
  </v-fade-transition>

  <v-fade-transition>
    <v-card
      v-if="uiStore.showExtensions"
      color="transparent"
      elevation="0"
      :width="548"
      class="drawer-container left-0"
      style="z-index: 9999"
    >
      <GlassCard
        variant="panel"
        padding="pa-0"
        class="fill-height overflow-hidden border-0"
      >
        <Extension />
      </GlassCard>
    </v-card>
  </v-fade-transition>

  <DragAndDrop :inline="false" :fullscreen="true" @files-selected="handleFilesDropped" />

  <DataManagerPiP v-if="uiStore.showDataManagerPiP" />
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 98;
  will-change: backdrop-filter;
  transform: translateZ(0);
  isolation: isolate;
  backface-visibility: hidden;
}

.drawer-container {
  position: fixed;
  top: 0;
  height: calc(100vh - 100px) !important;
  margin-top: 84px;
  padding: 16px;
  z-index: 99;
  isolation: isolate;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
