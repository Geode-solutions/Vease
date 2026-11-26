<script setup lang="ts">
import ActivityPiP from "@vease/components/activity/ActivityPiP.vue";
import ChatPiP from "@vease/components/chat/ChatPiP.vue";
import CreateTools from "@vease/components/CreateTools.vue";
import DataManagerPiP from "@vease/components/datamanager/DataManagerPiP.vue";
import DragAndDrop from "@ogw_front/components/DragAndDrop.vue";
import Extension from "@vease/components/Extension.vue";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import StepImport from "@vease/components/StepImport.vue";
import { useUserInterfaceStore } from "@vease/stores/user_interface";
import { useViewerStore } from "@ogw_front/stores/viewer";

const { userInterfaceStore } = defineProps<{
  userInterfaceStore: ReturnType<typeof useUserInterfaceStore>;
}>();

const emit = defineEmits<{ "files-dropped": [files: File[]]; "folders-dropped": [] }>();
const viewerStore = useViewerStore();

const showRightDrawer = computed(
  () => userInterfaceStore.showStepper || userInterfaceStore.showCreateTools,
);

function handleFilesDropped(files): void {
  emit("files-dropped", files);
}

function handleEscape(): void {
  if (userInterfaceStore.anyOverlayOpen && !viewerStore.picking_mode) {
    userInterfaceStore.closeAllDrawers();
  }
}
</script>

<template>
  <div
    v-if="userInterfaceStore.anyOverlayOpen"
    v-show="!viewerStore.picking_mode"
    class="drawer-overlay"
    @click="userInterfaceStore.closeAllDrawers()"
  />

  <v-card
    v-if="showRightDrawer"
    color="transparent"
    elevation="0"
    :width="userInterfaceStore.showStepper ? 548 : 380"
    class="drawer-container right-0"
  >
    <GlassCard
      variant="panel"
      padding="pa-0"
      class="fill-height overflow-hidden border-0 d-flex flex-column"
      :escapeFunction="handleEscape"
    >
      <StepImport
        v-if="userInterfaceStore.showStepper"
        data-testid="DataImportStepper"
        :files="userInterfaceStore.droppedFiles"
        @close="userInterfaceStore.setShowStepper(false)"
      />
      <div
        v-if="userInterfaceStore.showCreateTools"
        data-testid="createToolsPanel"
        class="d-flex flex-column h-100 w-100"
      >
        <CreateTools />
      </div>
    </GlassCard>
  </v-card>

  <v-fade-transition>
    <v-card
      v-if="userInterfaceStore.showExtensions"
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
        :escapeFunction="handleEscape"
      >
        <Extension />
      </GlassCard>
    </v-card>
  </v-fade-transition>

  <DragAndDrop
    :inline="false"
    :fullscreen="true"
    @files-selected="handleFilesDropped"
    @folders-ignored="emit('folders-dropped')"
  />

  <DataManagerPiP v-if="userInterfaceStore.showDataManagerPiP" />

  <ChatPiP v-if="userInterfaceStore.showChatPiP" />

  <ActivityPiP v-if="userInterfaceStore.showActivityPiP" />
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
  height: calc(100vh - 80px) !important;
  margin-top: 64px;
  padding: var(--vease-shell-gutter);
  z-index: 3;
  isolation: isolate;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
