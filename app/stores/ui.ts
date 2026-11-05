import { useDataManagerTabs, useToolsRegistry } from "@vease/composables/ui_registry";
import { useUiOverlays, useUiPanels } from "@vease/composables/ui_overlays";

const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false);
  const droppedFiles = ref<File[]>([]);
  const showButton = ref(false);
  const showStepImportMenu = ref(false);
  const tools = useToolsRegistry();
  const tabs = useDataManagerTabs();
  const overlays = useUiOverlays();
  const panels = useUiPanels();

  function setShowDropZone(value: boolean): void {
    showDropZone.value = value;
  }

  function setDroppedFiles(files: File[]): void {
    droppedFiles.value = files;
  }

  function setShowButton(value: boolean): void {
    showButton.value = value;
  }

  function toggleDrawer(): void {
    droppedFiles.value = [];
    overlays.showStepper.value = !overlays.showStepper.value;
  }

  return {
    ...tools,
    ...tabs,
    ...overlays,
    ...panels,
    showDropZone,
    droppedFiles,
    showButton,
    showStepImportMenu,
    setShowDropZone,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
  };
});

export type { ToolDefinition, DataManagerTab } from "@vease/composables/ui_registry";
export { useUIStore };
