import { useExtensionsStore } from "@vease/stores/extensions";

interface ToolDefinition {
  id: string;
  component: unknown;
  extensionPath?: string;
  title?: string;
  description?: string;
  iconType?: string;
  iconSource?: string;
  [key: string]: unknown;
}

interface DataManagerTab {
  id: string;
  component: unknown;
  props?: Record<string, unknown>;
  [key: string]: unknown;
}

const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false);
  const showStepper = ref(false);
  const droppedFiles = ref<File[]>([]);
  const showButton = ref(false);
  const showStepImportMenu = ref(false);
  const showCreateTools = ref(false);
  const toolsDefinitions = ref<ToolDefinition[]>([]);
  const showCreateVOI = ref(false);
  const showCreateAOI = ref(false);
  const showExtensions = ref(false);
  const showDataManagerPiP = ref(false);
  const showChatPiP = ref(false);
  const dataManagerTabs = ref<DataManagerTab[]>([]);

  const anyOverlayOpen = computed(
    () => showStepper.value || showCreateTools.value || showExtensions.value,
  );

  function registerToolComponent(toolDefinition: ToolDefinition, extensionPath?: string): void {
    const { id, component, ...rest } = toolDefinition;
    const existingIndex = toolsDefinitions.value.findIndex((tool) => tool.id === id);
    const newDefinition = { id, component, extensionPath, ...rest };
    if (existingIndex === -1) {
      toolsDefinitions.value.push(newDefinition);
    } else {
      toolsDefinitions.value[existingIndex] = {
        ...toolsDefinitions.value[existingIndex],
        ...newDefinition,
      };
    }
  }

  function unregisterTool(toolId: string): void {
    const index = toolsDefinitions.value.findIndex((tool) => tool.id === toolId);
    if (index === -1) {
      return;
    }
    toolsDefinitions.value.splice(index, 1);
    console.log(`[UIStore] Tool unregistered: ${toolId}`);
  }

  function unregisterToolsByExtension(extensionPath: string): void {
    const beforeCount = toolsDefinitions.value.length;
    toolsDefinitions.value = toolsDefinitions.value.filter(
      (tool) => tool.extensionPath !== extensionPath,
    );
    const removedCount = beforeCount - toolsDefinitions.value.length;
    console.log(`[UIStore] Removed ${removedCount} tools from extension: ${extensionPath}`);
  }

  function getActiveTools(): ToolDefinition[] {
    const extensionsStore = useExtensionsStore();
    return toolsDefinitions.value.filter((tool) => {
      if (tool.extensionPath === undefined || tool.extensionPath === "") {
        return true;
      }
      return extensionsStore.getExtensionEnabled(tool.extensionPath);
    });
  }

  const activeTools = computed(getActiveTools);

  function registerDataManagerTab(tabDefinition: DataManagerTab): void {
    const { id, component, ...rest } = tabDefinition;
    const existingIndex = dataManagerTabs.value.findIndex((tab) => tab.id === id);
    const newDefinition = { id, component, ...rest };
    if (existingIndex === -1) {
      dataManagerTabs.value.push(newDefinition);
    } else {
      dataManagerTabs.value[existingIndex] = {
        ...dataManagerTabs.value[existingIndex],
        ...newDefinition,
      };
    }
  }

  function setShowDropZone(value: boolean): void {
    showDropZone.value = value;
  }

  function setShowStepper(value: boolean): void {
    showStepper.value = value;
  }

  function setDroppedFiles(files: File[]): void {
    droppedFiles.value = files;
  }

  function setShowButton(value: boolean): void {
    showButton.value = value;
  }

  function toggleDrawer(): void {
    droppedFiles.value = [];
    showStepper.value = !showStepper.value;
  }

  function setShowCreateTools(value: boolean): void {
    showCreateTools.value = value;
  }

  function setShowExtensions(value: boolean): void {
    showExtensions.value = value;
  }

  function setShowCreateVOI(value: boolean): void {
    showCreateVOI.value = value;
  }

  function setShowCreateAOI(value: boolean): void {
    showCreateAOI.value = value;
  }

  function setShowDataManagerPiP(value: boolean): void {
    showDataManagerPiP.value = value;
  }

  function setShowChatPiP(value: boolean): void {
    showChatPiP.value = value;
  }

  return {
    toolsDefinitions,
    activeTools,
    dataManagerTabs,
    registerToolComponent,
    registerDataManagerTab,
    unregisterTool,
    unregisterToolsByExtension,
    showDropZone,
    showStepper,
    droppedFiles,
    showButton,
    showStepImportMenu,
    showCreateTools,
    showExtensions,
    showDataManagerPiP,
    showChatPiP,
    showCreateVOI,
    showCreateAOI,
    anyOverlayOpen,
    setShowDropZone,
    setShowStepper,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
    setShowCreateTools,
    setShowExtensions,
    setShowDataManagerPiP,
    setShowChatPiP,
    setShowCreateVOI,
    setShowCreateAOI,
  };
});

export type { ToolDefinition, DataManagerTab };
export { useUIStore };
