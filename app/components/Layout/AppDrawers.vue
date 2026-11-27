<script setup lang="ts">
import InfraConnected from "@ogw_front/components/InfraConnected.vue";
import { foldersIgnoredWarning } from "@ogw_front/utils/upload_path";
import { importProject } from "@ogw_front/composables/project_manager";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import { useUserInterfaceStore } from "@vease/stores/user_interface";

const userInterfaceStore = useUserInterfaceStore();

function isProjectFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".vease");
}

function handleFilesDropped(files: File[]): void {
  if (userInterfaceStore.showStepper || userInterfaceStore.showExtensions) {
    return;
  }
  // A .vease is a whole project: it is opened like from the Project menu, not imported as data
  if (files.some((file) => isProjectFile(file))) {
    const [projectFile] = files;
    if (files.length === 1 && projectFile !== undefined) {
      importProject(projectFile);
    } else {
      useFeedbackStore().add_warning("Drop a .vease project on its own to open it");
    }
    return;
  }
  userInterfaceStore.setDroppedFiles([...files]);
  userInterfaceStore.setShowStepper(true);
}

function handleFoldersDropped(): void {
  if (!userInterfaceStore.showStepper && !userInterfaceStore.showExtensions) {
    useFeedbackStore().add_warning(foldersIgnoredWarning);
  }
}
</script>
<template>
  <InfraConnected>
    <DrawerManager
      :user-interface-store="userInterfaceStore"
      @files-dropped="handleFilesDropped"
      @folders-dropped="handleFoldersDropped"
    />
  </InfraConnected>
</template>
