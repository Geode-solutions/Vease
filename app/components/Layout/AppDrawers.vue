<script setup lang="ts">
import InfraConnected from "@ogw_front/components/InfraConnected.vue";
import { foldersIgnoredWarning } from "@ogw_front/utils/upload_path";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();

function handleFilesDropped(files): void {
  if (!UIStore.showStepper && !UIStore.showExtensions) {
    UIStore.setDroppedFiles([...files]);
    UIStore.setShowStepper(true);
  }
}

function handleFoldersDropped(): void {
  if (!UIStore.showStepper && !UIStore.showExtensions) {
    useFeedbackStore().add_warning(foldersIgnoredWarning);
  }
}
</script>
<template>
  <InfraConnected>
    <DrawerManager
      :ui-store="UIStore"
      @files-dropped="handleFilesDropped"
      @folders-dropped="handleFoldersDropped"
    />
  </InfraConnected>
</template>
