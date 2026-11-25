import { consola } from "consola";
import { useExtensionsStore } from "@vease/stores/extensions";

interface ToolDefinition {
  id: string;
  component: unknown;
  extensionPath?: string;
  title?: string;
  description?: string;
  // "icon": iconSource is an icon of the app icon set (ph-...), "svg": the url of an svg image
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

// Icon type and names of the extension API before the Phosphor icons (Vease 2): "mdi" is still read as "icon", but
// MDI icon names have no glyph anymore: they are drawn as the generic extension icon, and reported so the extension
// Can move to Phosphor names (ph-...)
const LEGACY_ICON_TYPE = "mdi";
const FONT_ICON_TYPE = "icon";
const LEGACY_ICON_PREFIX = "mdi-";
const EXTENSION_ICON = "ph-puzzle-piece";

function currentIcon<Icon>(owner: string, icon: Icon): Icon | string {
  if (typeof icon !== "string" || !icon.startsWith(LEGACY_ICON_PREFIX)) {
    return icon;
  }
  consola.warn(`[userInterfaceStore] ${owner}: "${icon}" is an MDI icon, use a Phosphor icon name (ph-...)`);
  return EXTENSION_ICON;
}

function withCurrentIcon(toolDefinition: ToolDefinition): ToolDefinition {
  const current = {
    ...toolDefinition,
    iconSource: currentIcon(`Tool ${toolDefinition.id}`, toolDefinition.iconSource),
  };
  if (toolDefinition.iconType === LEGACY_ICON_TYPE) {
    consola.warn(`[userInterfaceStore] Tool ${toolDefinition.id}: iconType "mdi" is deprecated, use "icon"`);
    current.iconType = FONT_ICON_TYPE;
  }
  return current;
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
    const { id, component, ...rest } = withCurrentIcon(toolDefinition);
    upsertById(toolsDefinitions, { id, component, extensionPath, ...rest });
  }

  function unregisterTool(toolId: string): void {
    const index = toolsDefinitions.value.findIndex((tool) => tool.id === toolId);
    if (index === -1) {
      return;
    }
    toolsDefinitions.value.splice(index, 1);
    consola.info(`[userInterfaceStore] Tool unregistered: ${toolId}`);
  }

  function unregisterToolsByExtension(extensionPath: string): void {
    const beforeCount = toolsDefinitions.value.length;
    toolsDefinitions.value = toolsDefinitions.value.filter(
      (tool) => tool.extensionPath !== extensionPath,
    );
    const removedCount = beforeCount - toolsDefinitions.value.length;
    consola.info(`[userInterfaceStore] Removed ${removedCount} tools from extension: ${extensionPath}`);
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
    const icon = currentIcon(`Data manager tab ${tabDefinition.id}`, tabDefinition.icon);
    const { id, component, ...rest } = { ...tabDefinition, icon };
    upsertById(dataManagerTabs, { id, component, ...rest });
  }

  return { dataManagerTabs, registerDataManagerTab };
}

export type { ToolDefinition, DataManagerTab };
export { useToolsRegistry, useDataManagerTabs };
