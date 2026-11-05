import { consola } from "consola";
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

function upsertById<Item extends { id: string }>(list: Ref<Item[]>, newDefinition: Item): void {
  const existingIndex = list.value.findIndex((entry) => entry.id === newDefinition.id);
  if (existingIndex === -1) {
    list.value.push(newDefinition);
  } else {
    list.value[existingIndex] = { ...list.value[existingIndex], ...newDefinition };
  }
}

interface ToolsRegistry {
  toolsDefinitions: Ref<ToolDefinition[]>;
  activeTools: ComputedRef<ToolDefinition[]>;
  registerToolComponent: (toolDefinition: ToolDefinition, extensionPath?: string) => void;
  unregisterTool: (toolId: string) => void;
  unregisterToolsByExtension: (extensionPath: string) => void;
}

function useToolsRegistry(): ToolsRegistry {
  const toolsDefinitions = ref<ToolDefinition[]>([]);

  function registerToolComponent(toolDefinition: ToolDefinition, extensionPath?: string): void {
    const { id, component, ...rest } = toolDefinition;
    upsertById(toolsDefinitions, { id, component, extensionPath, ...rest });
  }

  function unregisterTool(toolId: string): void {
    const index = toolsDefinitions.value.findIndex((tool) => tool.id === toolId);
    if (index === -1) {
      return;
    }
    toolsDefinitions.value.splice(index, 1);
    consola.info(`[UIStore] Tool unregistered: ${toolId}`);
  }

  function unregisterToolsByExtension(extensionPath: string): void {
    const beforeCount = toolsDefinitions.value.length;
    toolsDefinitions.value = toolsDefinitions.value.filter(
      (tool) => tool.extensionPath !== extensionPath,
    );
    const removedCount = beforeCount - toolsDefinitions.value.length;
    consola.info(`[UIStore] Removed ${removedCount} tools from extension: ${extensionPath}`);
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

  return {
    toolsDefinitions,
    activeTools,
    registerToolComponent,
    unregisterTool,
    unregisterToolsByExtension,
  };
}

interface DataManagerTabs {
  dataManagerTabs: Ref<DataManagerTab[]>;
  registerDataManagerTab: (tabDefinition: DataManagerTab) => void;
}

function useDataManagerTabs(): DataManagerTabs {
  const dataManagerTabs = ref<DataManagerTab[]>([]);

  function registerDataManagerTab(tabDefinition: DataManagerTab): void {
    const { id, component, ...rest } = tabDefinition;
    upsertById(dataManagerTabs, { id, component, ...rest });
  }

  return { dataManagerTabs, registerDataManagerTab };
}

export type { ToolDefinition, DataManagerTab };
export { useToolsRegistry, useDataManagerTabs };
