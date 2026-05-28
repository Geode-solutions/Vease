<script setup>
import CreateTools from "@vease/components/CreateTools";
import DataManagerPiP from "@vease/components/datamanager/DataManagerPiP.vue";
import DragAndDrop from "@ogw_front/components/DragAndDrop";
import Extension from "@vease/components/Extension";
import GlassCard from "@ogw_front/components/GlassCard";
import StepImport from "@vease/components/StepImport";
import { useViewerStore } from "@ogw_front/stores/viewer";

const { uiStore } = defineProps({
  uiStore: { type: Object, required: true },
});

const emit = defineEmits(["files-dropped"]);
const viewerStore = useViewerStore();

function closeAllDrawers() {
  uiStore.setShowStepper(false);
  uiStore.setShowCreateTools(false);
  uiStore.setShowExtensions(false);
}

const anyDrawerOpen = computed(
  () => uiStore.showStepper || uiStore.showCreateTools || uiStore.showExtensions,
);
const showRightDrawer = computed(() => uiStore.showStepper || uiStore.showCreateTools);

function handleFilesDropped(files) {
  emit("files-dropped", files);
}
</script>

<template>
  <div
    v-if="anyDrawerOpen"
    v-show="!viewerStore.picking_mode"
    class="drawer-overlay"
    @click="closeAllDrawers"
  />

  <v-card
    v-if="showRightDrawer"
    color="transparent"
    elevation="0"
    :width="uiStore.showStepper ? 548 : 380"
    class="drawer-container right-0"
  >
    <GlassCard
      variant="panel"
      padding="pa-0"
      class="fill-height overflow-hidden border-0 d-flex flex-column"
    >
      <StepImport
        v-if="uiStore.showStepper"
        :files="uiStore.droppedFiles"
        @close="uiStore.setShowStepper(false)"
      />
      <CreateTools v-if="uiStore.showCreateTools" />
    </GlassCard>
  </v-card>

  <v-fade-transition>
    <v-card
      v-if="uiStore.showExtensions"
      color="transparent"
      elevation="0"
      :width="380"
      class="drawer-container left-0"
      style="z-index: 4"
    >
      <GlassCard
        variant="panel"
        padding="pa-0"
        class="fill-height overflow-hidden border-0 d-flex flex-column"
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
  z-index: 2;
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
  z-index: 3;
  isolation: isolate;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
