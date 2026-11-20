<script setup lang="ts">
import InfraConnected from "@ogw_front/components/InfraConnected.vue";
import { foldersIgnoredWarning } from "@ogw_front/utils/upload_path";
import { importProject } from "@ogw_front/composables/project_manager";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();

function isProjectFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".vease");
}

function handleFilesDropped(files: File[]): void {
  if (UIStore.showStepper || UIStore.showExtensions) {
    return;
  }
  // A .vease is a whole project: it is opened like from the Project menu, not imported as data
  if (files.some((file) => isProjectFile(file))) {
    if (files.length === 1) {
      importProject(files[0]);
    } else {
      useFeedbackStore().add_warning("Drop a .vease project on its own to open it");
    }
    return;
  }
  UIStore.setDroppedFiles([...files]);
  UIStore.setShowStepper(true);
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
